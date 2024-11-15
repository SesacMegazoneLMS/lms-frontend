export const assignmentAPI = {
  getAssignments: async () => {
    const response = await fetch('/api/assignments')
    if (!response.ok) throw new Error('Failed to fetch assignments')
    return response.json()
  }
}
