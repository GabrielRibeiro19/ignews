import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'


const posts = [
  {
    slug: 'my-new-post',
    title: 'my new post',
    excerpt: 'Post excerpt',
    updatedAt: '10 de Abril'
  }
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {

    render(<Posts posts={posts}/>)

    expect(screen.getByText("my new post")).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                {type: 'heading', text: 'my new post'}
              ],
              content: [
                {type: 'paragraph', text: 'post excerpt'}
              ],
            },
            last_publication_date: '12-19-2023',
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    // console.log(response.props.posts)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'my new post',
              excerpt: 'post excerpt',
              updatedAt: '19 de dezembro de 2023',
            }
          ]
        }
      })
    )
  })
})
