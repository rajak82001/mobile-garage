import useAppController from './useAppController'
import Theme1Shell from '../themes/theme1/Theme1Shell'

export default function AppShell() {
  const controller = useAppController()
  return <Theme1Shell controller={controller} />
}
