import { useState, FormEvent } from 'react'
import store from 'store'

import { useRecoil } from 'hooks/state'
import useFormInput from 'hooks/useFormInput'
import { currentUserState } from 'states/user'
import { getUserDataDB } from 'services/user'

import SnackBar from 'components/SnackBar'
import { useSnackbar } from 'components/SnackBar/useSnackBar'
import { validateId, validatePassword } from 'utils/validates/validateInput'
import { SignInIcon } from 'assets/svgs'
import styles from './signIn.module.scss'
import LoginForm from './LoginForm'
import { useI18n } from 'hooks'

const SignIn = (): JSX.Element => {
  const t = useI18n()
  const [, setCurrentUser] = useRecoil(currentUserState)

  const id = useFormInput({ validateFunction: validateId })
  const password = useFormInput({ validateFunction: validatePassword })

  const [snackBarStatus, setSnackBarStatus] = useState('')
  const { message, setMessage } = useSnackbar(5000)

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!id.valueIsValid || !password.valueIsValid) {
      setSnackBarStatus('warning')
      setMessage(`${t('front:signIn.snackBarValid')}`)
      return
    }

    getUserDataDB(id.value)
      .then((res) => {
        if (res.length < 1) {
          setSnackBarStatus('error')
          setMessage(`${t('front:signIn.snackBarError')}`)
          return
        }
        store.set('currentUser', res[0])
        setCurrentUser(res[0])
      })
      .catch((error) => {
        setSnackBarStatus('error')
        setMessage(`Error: ${error}`)
      })
  }

  return (
    <main className={styles.formWrapper}>
      <header className={styles.header}>
        <h3 className={styles.id}>
          <SignInIcon />
        </h3>
      </header>

      <div className={styles.content}>
        <LoginForm onSubmit={handleOnSubmit} id={id} password={password} />
      </div>
      {message && <SnackBar message={message} status={snackBarStatus} setMessage={setMessage} />}
    </main>
  )
}

export default SignIn
