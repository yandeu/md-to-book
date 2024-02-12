interface Window {
  get_remote_data: () => Promise<Array<string>>
  store_remote_data: (data: string) => Promise<boolean>
}
