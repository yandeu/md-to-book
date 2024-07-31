// @ts-check

/// <reference path="./types.d.ts" />

import { set } from './misc.esm.js'

/**
 *
 * @returns {Promise<boolean>}
 */
const simulateRemoteDelay = () => new Promise(r => setTimeout(() => r(true), 200))

export class ManageStorage {
  /**
   * @param {string} path
   * @param {"local" | "remote" | null} storageType
   */
  constructor(path = window.location.pathname, storageType = null) {
    this.path = path
    this.storageType = storageType

    if (!this.storageType) {
      this.storageType = document.body.getAttribute('data-storage') || 'local'
    }
  }

  /**
   *
   * @param {number} index
   * @returns {Promise<string | null>}
   */
  async getDataByIndex(index) {
    const data = await this.getData()
    if (data?.length >= index) {
      return data[index]
    }
    return null
  }

  /**
   *
   * @param {number} index
   * @param {string} text
   */
  async setDataByIndex(index, text) {
    const currData = await this.getData()
    const newData = set(currData, index, text)

    console.log('new data', index, text, newData)
    this.setData(newData)
  }

  /**
   *
   * @returns {Promise<Array<string>>}
   */
  async getData() {
    if (this.storageType === 'local') {
      const storage = window.localStorage.getItem(this.path)
      return typeof storage === 'string' ? JSON.parse(storage) : []
    } else if (this.storageType === 'remote') {
      if (window.get_remote_data && typeof window.get_remote_data === 'function') {
        return (await window.get_remote_data()) || []
      } else {
        return []
      }
    }
    return []
  }

  /**
   *
   * @param {any} data
   * @returns {Promise<boolean>}
   */
  async setData(data) {
    if (this.storageType === 'local') {
      window.localStorage.setItem(this.path, JSON.stringify(data))
      return true
    } else if (this.storageType === 'remote') {
      if (window.store_remote_data && typeof window.store_remote_data === 'function') {
        return await window.store_remote_data(JSON.stringify(data))
      } else {
        return false
      }
    }
    return true
  }

  /**
   *
   * @param {number} index
   * @param {string} newData
   * @returns {Promise<boolean>}
   */
  async adjustData(index, newData) {
    const data = await this.getData()
    data[index] = newData
    return await this.setData(data)
  }
}
