import type { TestRepository } from "@/lib/data/test-repository"
import { MockTestRepository } from "@/lib/data/mock/mock-test-repository"
import type { AuthProvider } from "@/lib/auth/types"
import { LocalJsonAuthProvider } from "@/lib/auth/local-json-auth-provider"

// Single composition root for both data-access seams. Route handlers and
// Server Components must call these factories instead of instantiating
// MockTestRepository/LocalJsonAuthProvider directly — that's what keeps the
// future ERPNext swap (an ErpnextTestRepository / ErpnextAuthProvider behind
// the same interfaces, selected via an env var here) a contained change.
let testRepository: TestRepository | null = null
let authProvider: AuthProvider | null = null

export function getTestRepository(): TestRepository {
  if (!testRepository) testRepository = new MockTestRepository()
  return testRepository
}

export function getAuthProvider(): AuthProvider {
  if (!authProvider) authProvider = new LocalJsonAuthProvider()
  return authProvider
}
