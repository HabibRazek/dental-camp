// Silent logger - suppresses all console output in development
const isDevelopment = process.env.NODE_ENV === 'development'
const isSilentMode = process.env.SILENT_MODE === 'true' || true // Always silent

// Override console methods to suppress output
if (isDevelopment && isSilentMode) {
  const originalConsole = { ...console }
  
  // Suppress all console output except critical errors
  console.log = () => {}
  console.info = () => {}
  console.warn = () => {}
  console.debug = () => {}
  console.trace = () => {}
  console.table = () => {}
  console.group = () => {}
  console.groupEnd = () => {}
  console.time = () => {}
  console.timeEnd = () => {}
  
  // Only allow critical errors to show
  console.error = (...args: any[]) => {
    // Only show critical system errors, not application errors
    const message = args.join(' ')
    if (message.includes('ECONNREFUSED') || 
        message.includes('ENOTFOUND') || 
        message.includes('MODULE_NOT_FOUND') ||
        message.includes('SyntaxError')) {
      originalConsole.error(...args)
    }
  }
}

// Silent fetch wrapper
const originalFetch = global.fetch
if (typeof window === 'undefined' && originalFetch) {
  global.fetch = async (...args) => {
    try {
      return await originalFetch(...args)
    } catch (error) {
      // Silently handle fetch errors
      throw error
    }
  }
}

export const logger = {
  log: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
}

export default logger
