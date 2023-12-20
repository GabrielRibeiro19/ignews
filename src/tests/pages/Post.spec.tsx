import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/react'


const post =
{
  slug: 'my-new-post',
  title: 'my new post',
  content: '<p>Post excerpt</p>',
  updatedAt: '10 de Abril'
}

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Post page', () => {
  it('renders correctly', () => {

    render(<Post post={post} />)

    expect(screen.getByText("my new post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    // console.log(response.props.posts)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining(
          {
            destination: '/',
          }
        )
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)

    const getPrismicClientMocked = jest.mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {type: 'heading', text: 'my new post'}
          ],
          content: [
            {type: 'paragraph', text: 'Post content'}
          ],
        },
        last_publication_date: '12-19-2023',
      }),
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    // console.log(response.props.posts)

    expect(response).toEqual(
      expect.objectContaining({
       props: {
        post: {
          slug: 'my-new-post',
          title: 'my new post',
          content: '<p>Post content</p>',
          updatedAt: '19 de dezembro de 2023'
        }
       }
      })
    )
  })
})
