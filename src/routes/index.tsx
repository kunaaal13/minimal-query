import { createFileRoute, useNavigate } from '@tanstack/react-router'
import usePosts from '~/usePosts'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate()

  const postsQuery = usePosts()

  return (
    <div className='p-2'>
      <h3>Welcome Home!!!</h3>

      {postsQuery.status === 'pending' && <div>Loading...</div>}
      {postsQuery.status === 'success' && (
        <div className='w-full grid grid-cols-3 gap-2'>
          {postsQuery.data?.map((post) => (
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
