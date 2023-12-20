import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/react'

import { SubscribeButton } from '.'
import { useRouter } from 'next/router'

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton Component', () => {
  it('renders correctly', () => {

    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    } as any);
    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = jest.mocked(signIn)

    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    } as any);

    render(<SubscribeButton />)
    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })
  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const useSessionMocked = jest.mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        activeSubscription: 'fake-active',
        expires: "fake-expires",
      },
      status: 'authenticated'
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})
