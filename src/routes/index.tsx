import { createFileRoute, useNavigate } from '@tanstack/react-router'
import useQuery from '~/query-hooks/use-query'
import { sleep } from '~/utils/sleep'

export const Route = createFileRoute('/')({
  component: Home,
})

const key = ['Posts']

type Post = {
  id: number
  title: string
  body: string
  userId: number
}

function Home() {
  const navigate = useNavigate()

  const query = useQuery({
    queryFn: async (): Promise<Post[]> => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      await sleep(3000)
      return res.json()
    },
    queryKey: key,
  })

  return (
    <div className='p-2'>
      <h3>Welcome Home!!!</h3>

      {query.status === 'pending' && <div>Loading...</div>}
      {query.status === 'success' && (
        <div className='w-full grid grid-cols-3 gap-2'>
          {query.data?.map((post) => (
            <div
              key={post.id}
              className='p-2 border rounded-md bg-gray-100 flex flex-col gap-2'
              onClick={() => {
                navigate({
                  to: '/posts/$id',
                  params: { id: post.id.toString() },
                })
              }}
            >
              <h4 className='text-lg font-bold text-red-500'>{post.title}</h4>
              <p className='text-sm text-gray-500'>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
