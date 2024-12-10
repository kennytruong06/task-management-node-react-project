import axios from 'axios'

const API_URL = 'http://localhost:3002/tasks'

export const fetchTasks = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/${taskId}`)
    console.log('Task deleted successfully')
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

export const completeTask = async (taskId) => {
  try {
    await axios.patch(`${API_URL}/${taskId}`)
    console.log('Task marked as completed')
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(API_URL, taskData, {
      headers: { 'Content-Type': 'application/json' },
    })
    console.log('Task created successfully')
    return response.data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}
