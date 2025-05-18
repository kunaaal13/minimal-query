import { createFileRoute, useNavigate } from '@tanstack/react-router'
import usePosts from '~/usePosts'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate()

  const postsQuery = usePosts()

  return (
    <div className='p-2 flex flex-col gap-5'>
      <h3>Welcome Home!!!</h3>

      <div className='w-full grid grid-cols-3 gap-2'>
        {postsQuery.isLoading && (
          <div className='col-span-3 min-h-96 flex items-center justify-center'>
            <div className='size-10 rounded-full border-2 border-blue-600 animate-ping'></div>
          </div>
        )}
        {postsQuery.data?.map((post) => (
          <div
            key={post.id}
            className='p-2 border rounded-md bg-gray-100 flex flex-col gap-2 cursor-pointer'
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
    </div>
  )
}
