import jwt from "jsonwebtoken"

export interface AdminTokenPayload {
  adminId: string
  username: string
  role: string
  iat: number
  exp: number
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "fallback-secret"
    ) as AdminTokenPayload
    
    return decoded
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function isTokenExpired(token: AdminTokenPayload): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  return token.exp < currentTime
}

// Client-side auth helpers
export const adminAuth = {
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token")
    }
    return null
  },

  getAdmin: () => {
    if (typeof window !== "undefined") {
      const adminData = localStorage.getItem("admin_user")
      return adminData ? JSON.parse(adminData) : null
    }
    return null
  },

  isAuthenticated: () => {
    const token = adminAuth.getToken()
    if (!token) return false

    try {
      const decoded = jwt.decode(token) as AdminTokenPayload
      if (!decoded) return false

      const currentTime = Math.floor(Date.now() / 1000)
      return decoded.exp > currentTime
    } catch {
      return false
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token")
      localStorage.removeItem("admin_user")
      window.location.href = "/admin/login"
    }
  }
}
