import axios from 'axios'
import type { ApiResponse, StudentResult, TopGroupAStudent, SubjectStatistic } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getStudentScores = async (sbd: string): Promise<StudentResult> => {
  const { data } = await api.get<ApiResponse<StudentResult>>(`/scores/${sbd}`)
  return data.data
}

export const getTopGroupA = async (): Promise<TopGroupAStudent[]> => {
  const { data } = await api.get<ApiResponse<TopGroupAStudent[]>>('/top-group-a')
  return data.data
}

export const getStatisticsForSubjects = async (subject?: string): Promise<SubjectStatistic[]> => {
  const { data } = await api.get<ApiResponse<SubjectStatistic[]>>(`/statistics${subject ? `?subject=${subject}` : ''}`)
  return data.data
}

export default api
