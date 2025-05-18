import useQuery from './query-hooks/use-query'
import { sleep } from './utils/sleep'

type Post = {
  id: number
  title: string
  body: string
  userId: number
}

function usePosts() {
  const query = useQuery({
    queryFn: async (): Promise<Post[]> => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      await sleep(3000)
      return res.json()
    },
    queryKey: ['posts'],
  })

  return query
}

export default usePosts
