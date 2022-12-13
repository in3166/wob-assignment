import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { useRecoil } from 'hooks/state'
// import { useIntersectionObserver } from 'hooks/useIntersectionObserver'
import { currentUserState } from 'stores/user'
import Container from 'components/_shared/Container'
import Card from 'components/_shared/Card'
import styles from './productList.module.scss'
import { IProductItem } from 'types/product'
import Loading from 'components/_shared/Loding'

interface IMainPageProps {
  products: IProductItem[]
}
const ProductList = ({ products }: IMainPageProps) => {
  // const ref = useRef<HTMLDivElement | null>(null)
  const [productsList, setproductsList] = useState(products)

  const [isLoading, setIsLoading] = useState(false)
  // const setTarget = useIntersectionObserver(ref, { rootMargin: '10px', threshold: 0 }, setIsLoading, setproductsList)
  const router = useRouter()

  const { data: session } = useSession()
  const [user, setUser] = useRecoil(currentUserState)

  useEffect(() => {
    if (!user && session?.user) setUser(session.user)
    console.log('recoil user: ', user)
  }, [session, setUser, user])

  useEffect(() => {
    setIsLoading(true)
    const { query: searchText } = router
    if (searchText?.text) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/search?text=${searchText?.text}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        const data = await response.json()
        if (data.success) {
          setproductsList(data.product)
          setIsLoading(false)
        }
      })
    } else {
      setIsLoading(false)
    }
  }, [router])

  return (
    <Container width='lg'>
      {productsList?.length < 1 && <div>No Items.</div>}
      {!isLoading && (
        <ul className={styles.cardContainer}>
          {productsList?.map((value) => {
            return <Card key={value._id} product={value} user={user} setUser={setUser} />
          })}
        </ul>
      )}
      {/* {!isLoading && <ScrollDetecor setTarget={setTarget} />} */}
      {isLoading && <Loading />}
    </Container>
  )
}

export default ProductList
