import { createFileRoute, useNavigate } from '@tanstack/react-router'
import useQuery from '~/query-hooks/use-query'
import usePosts from '~/usePosts'
import { sleep } from '~/utils/sleep'

export const Route = createFileRoute('/posts/$id')({
  component: RouteComponent,
})

type Post = {
  id: number
  title: string
  body: string
  userId: number
}

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const postsQuery = usePosts()

  const query = useQuery({
    queryFn: async (): Promise<Post> => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      )
      await sleep(3000)
      return res.json()
    },
    queryKey: ['posts', id],
  })

  return (
    <div className='p-2'>
      <button onClick={() => navigate({ to: '/' })}>Back</button>

      <h3>Post {id}</h3>

      {query.status === 'pending' && <div>Loading...</div>}
      {query.status === 'success' && (
        <div className='p-2 border rounded-md bg-gray-100 flex flex-col gap-2'>
          <h4 className='text-lg font-bold text-red-500'>
            {query.data?.title}
          </h4>
          <p className='text-sm text-gray-500'>{query.data?.body}</p>
        </div>
      )}
      {query.status === 'error' && <div>Error: {query.error?.message}</div>}
    </div>
  )
}
