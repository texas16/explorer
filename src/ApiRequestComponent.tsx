import React, { ReactElement, useEffect, useState } from 'react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import MainWrapper from './MainWrapper'
import { DataOrErrors, FetchError } from './api_clients/FetchTypes'

interface ApiRequestPageProps<T> {
  children: ReactElement
  request: (...args: any[]) => Promise<DataOrErrors<T>>
  args?: any[]
  loadingComponent?: ReactElement
  errorComponent?: ReactElement
}

export function PlainErrorComponent() {
  return (
    <span role='dialog' className='network-error'>
      Something went wrong. Please try again later
    </span>
  )
}

export function FullPageErrorComponent() {
  return (
    <MainWrapper>
      <PlainErrorComponent />
    </MainWrapper>
  )
}

const DefaultErrorComponent = FullPageErrorComponent

export function PlainLoadingComponent() {
  return (
    <span className='loading' role='loading'>
      Loading, please wait
    </span>
  )
}

export function FullPageLoadingComponent() {
  return (
    <MainWrapper>
      <PlainLoadingComponent />
    </MainWrapper>
  )
}

const DefaultLoadingComponent = FullPageLoadingComponent

function ApiRequestComponent<T>({
  request,
  args = [],
  children,
  loadingComponent = <DefaultLoadingComponent />,
  errorComponent = <DefaultErrorComponent />,
}: ApiRequestPageProps<T>) {
  const [response, setResponse] = useState<T | undefined>(undefined)
  const [errors, setErrors] = useState<FetchError[] | null>([])
  const [loading, setLoading] = useState<boolean | undefined>(true)

  useEffect(() => {
    async function getResponse() {
      await request(...args).then((apiResponse) => {
        if ('data' in apiResponse) {
          setResponse(apiResponse.data)
          setLoading(false)
        } else {
          setErrors(apiResponse.errors)
          setLoading(false)
        }
      })
    }

    getResponse()
  }, [])

  function renderContent(): ReactJSXElement {
    if (loading) {
      return <>{React.cloneElement(loadingComponent)}</>
    } else if (errors && errors.length) {
      console.error('Error loading the ApiRequestComponent: ', errors)
      return <>{React.cloneElement(errorComponent, { errors })}</>
    } else {
      return <>{React.cloneElement(children, { data: response })}</>
    }
  }

  return renderContent()
}

export default ApiRequestComponent