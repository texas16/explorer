import { Card, FormControl, InputGroup } from 'react-bootstrap'
import React, { ReactNode } from 'react'
import ApiRequestComponent from '../../ApiRequestComponent'
import MainWrapper from '../../MainWrapper'
import {
  TransactionRow,
  transformAnalyticsTransactionIntoTransaction,
} from '../Common/TransactionModel'
import Table, { column } from '../../Table'
import { useHistory } from 'react-router-dom'
import './LandingPage.css'
import { TransactionVersion } from '../../TableComponents/Link'
import { postQueryToAnalyticsApi } from '../../api_clients/AnalyticsClient'
import { DataOrErrors } from '../../api_clients/FetchTypes'
import {
  countTransactionsInLast10Minutes,
  CountTransactionsInLast10MinutesType,
  LatestMintBurnNetQuery,
  transactionsQuery,
  TransactionsQueryType,
} from '../../api_clients/AnalyticsQueries'
import ReactTooltip from 'react-tooltip'
import { GraphQLTypes } from '../../../generated/Analytics_Hasura_Api_Zeus_Client/zeus'
import { getCanonicalAddress } from '../../utils'

function Wrapper(props: { children: ReactNode }) {
  return (
    <MainWrapper>
      <>
        <h2 className='mb-5' role='note'>
          Welcome To Diem Explorer
        </h2>
        {props.children}
      </>
    </MainWrapper>
  )
}

type CurrentStatisticsCardProps = {
  averageTps: number
  totalMintValue: number
  totalBurnValue: number
  totalNetValue: number
}

function CurrentStatisticsCard({
  averageTps,
  totalMintValue,
  totalBurnValue,
  totalNetValue,
}: CurrentStatisticsCardProps) {
  return (
    <Card className='mb-5' data-testid='statisticsCard'>
      <Card.Header>Current Statistics</Card.Header>
      <Card.Body
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <section style={{}}>
          <dl data-tip data-for={'Transactions Per Second'}>
            <dt
              style={{
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
              }}
            >
              TPS
            </dt>
            <dd>{new Intl.NumberFormat().format(averageTps)}</dd>
          </dl>
          <ReactTooltip id='Transactions Per Second' effect='solid'>
            Transactions Per Second
          </ReactTooltip>
        </section>
        <section>
          <dl>
            <dt>Total Mint Value</dt>
            <dd>{new Intl.NumberFormat().format(totalMintValue)} XUS</dd>
          </dl>
        </section>
        <section>
          <dl>
            <dt>Total Burn Value</dt>
            <dd>{new Intl.NumberFormat().format(totalBurnValue)} XUS</dd>
          </dl>
        </section>
        <section>
          <dl>
            <dt>XUS In Circulation</dt>
            <dd>{new Intl.NumberFormat().format(totalNetValue)} XUS</dd>
          </dl>
        </section>
      </Card.Body>
    </Card>
  )
}

function TransactionTable(props: { transactions: TransactionRow[] }) {
  return (
    <>
      <h3 className='mb-2'>Recent Transactions</h3>
      <Table
        columns={[
          column('Version', 'version', TransactionVersion),
          column('Timestamp', 'commitTimestamp'),
          column('Type', 'txnType'),
          column('Status', 'status'),
        ]}
        data={props.transactions}
        id='landingPageTransactions'
      />
    </>
  )
}

type LandingPageWithResponseProps = {
  data: {
    recentTransactions: TransactionRow[]
    averageTps: number
    totalMintAmount: number
    totalBurnAmount: number
    totalNetAmount: number
  }
}
function LandingPageWithResponse(props: LandingPageWithResponseProps) {
  const history = useHistory()

  function getSearchRouteFromSearchTerm(term: string): string | null {
    if (/^[0-9]+$/i.test(term)) {
      return `/txn/${term}`
    }

    const maybeAddress = getCanonicalAddress(term)
    if (maybeAddress.ok) {
      return `/address/${maybeAddress.val}`
    }

    return null
  }

  function handleSearch(event: any) {
    // Enter Key
    if (event.key === 'Enter') {
      const searchRoute = getSearchRouteFromSearchTerm(event.target.value)
      if (searchRoute) {
        history.push(searchRoute)
      }
    }
  }

  return (
    <Wrapper>
      <InputGroup className='mb-5'>
        <FormControl
          placeholder='Search by Address or Transaction Version'
          aria-label='Search by Address or Transaction Version'
          onKeyPress={handleSearch}
        />
      </InputGroup>
      <CurrentStatisticsCard
        averageTps={props.data.averageTps}
        totalMintValue={props.data.totalMintAmount}
        totalBurnValue={props.data.totalBurnAmount}
        totalNetValue={props.data.totalNetAmount}
      />
      <TransactionTable transactions={props.data.recentTransactions} />
    </Wrapper>
  )
}

function transformAnalyticsTransactionsOrErrors(
  response: DataOrErrors<TransactionsQueryType>
): DataOrErrors<TransactionRow[]> {
  if ('data' in response) {
    return {
      data: response.data.map(transformAnalyticsTransactionIntoTransaction),
    }
  } else {
    return {
      errors: response.errors,
    }
  }
}

export default function LandingPage() {
  const nullData = {
    recentTransactions: [],
    averageTps: NaN,
    totalMintAmount: NaN,
    totalBurnAmount: NaN,
    totalNetAmount: NaN,
  }
  return (
    <ApiRequestComponent
      request={async () => {
        const txnsInLast10m =
          await postQueryToAnalyticsApi<CountTransactionsInLast10MinutesType>(
            countTransactionsInLast10Minutes(),
            'transactions_aggregate'
          )
        const recentTxns = await postQueryToAnalyticsApi<TransactionsQueryType>(
          transactionsQuery(),
          'transactions'
        ).then(transformAnalyticsTransactionsOrErrors)
        const latestMintBurnNetAmounts = await postQueryToAnalyticsApi<
          GraphQLTypes['diem_in_circulation_realtime_aggregates'][]
        >(LatestMintBurnNetQuery(), 'diem_in_circulation_realtime_aggregates')

        if (
          'errors' in txnsInLast10m ||
          'errors' in recentTxns ||
          'errors' in latestMintBurnNetAmounts
        ) {
          return {
            errors: []
              // @ts-ignore nulls work in concat -- this will smash together the error arrays then remove nulls
              .concat(txnsInLast10m.errors)
              // @ts-ignore nulls work in concat -- this will smash together the error arrays then remove nulls
              .concat(recentTxns.errors)
              // @ts-ignore nulls work in concat -- this will smash together the error arrays then remove nulls
              .concat(latestMintBurnNetAmounts.errors)
              .filter((error) => error !== null),
          }
        } else {
          return {
            data: {
              recentTransactions: recentTxns.data,
              averageTps: txnsInLast10m.data.aggregate.count / 600,
              totalMintAmount:
                latestMintBurnNetAmounts.data[0]?.total_mint_value,
              totalBurnAmount:
                latestMintBurnNetAmounts.data[0]?.total_burn_value,
              totalNetAmount: latestMintBurnNetAmounts.data[0]?.total_net_value,
            },
          }
        }
      }}
    >
      <LandingPageWithResponse data={nullData} />
    </ApiRequestComponent>
  )
}
