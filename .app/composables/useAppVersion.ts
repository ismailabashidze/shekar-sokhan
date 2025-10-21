export function useAppVersion() {
  const config = useRuntimeConfig()
  const version = useState('app-version', () => config.public?.appVersion ?? '0.0.0')

  return {
    version,
  }
}
