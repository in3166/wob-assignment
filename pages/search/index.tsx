import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppSelector } from 'hooks'
import { useRecoil } from 'hooks/state'
import { getSearchList } from 'stores/reducer/product'
import { currentUserState } from 'stores/user'

import Container from 'components/_shared/Container'
import Card from 'components/_shared/Card'
import styles from './searchPage.module.scss'

const SearchPage = () => {
  const data = useAppSelector(getSearchList)
  const [user, setUser] = useRecoil(currentUserState)

  return (
    <main className={styles.main}>
      <Container>
        <ul className={styles.cardContainer}>
          {data.map((value) => {
            return <Card key={value.id} item={value} user={user} setUser={setUser} />
          })}
        </ul>
      </Container>
    </main>
  )
}

export const getStaticProps = async ({ locale, locales }: { locale: string; locales: string[] }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locales,
    },
  }
}

export default SearchPage
