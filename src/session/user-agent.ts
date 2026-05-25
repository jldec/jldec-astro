import UAParser from 'my-ua-parser'

export interface UserAgentDetails {
  browserName: string | null
  browserVersion: string | null
  osName: string | null
  deviceType: string | null
  deviceVendor: string | null
  deviceModel: string | null
}

export interface UserAgentSummary {
  short: string | null
  details: UserAgentDetails
}

export function summarizeUserAgent(userAgent: string | null): UserAgentSummary {
  if (!userAgent) {
    return {
      short: null,
      details: emptyDetails()
    }
  }

  const parsed = UAParser(userAgent)
  const details: UserAgentDetails = {
    browserName: normalize(parsed.browser.name),
    browserVersion: majorVersion(parsed.browser.version),
    osName: normalize(parsed.os.name),
    deviceType: normalize(parsed.device.type),
    deviceVendor: normalize(parsed.device.vendor),
    deviceModel: normalize(parsed.device.model)
  }

  const browser = [details.browserName, details.browserVersion].filter(Boolean).join(' ').trim()
  const short = [browser || null, details.osName, details.deviceType].filter(Boolean).join(' ') || null

  return {
    short,
    details
  }
}

function normalize(value: string | undefined): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function majorVersion(value: string | undefined): string | null {
  const normalized = normalize(value)
  if (!normalized) return null

  const [major] = normalized.split('.')
  return major || null
}

function emptyDetails(): UserAgentDetails {
  return {
    browserName: null,
    browserVersion: null,
    osName: null,
    deviceType: null,
    deviceVendor: null,
    deviceModel: null
  }
}
