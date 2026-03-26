<template>
  <div>
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" />
      <h1 class="text-h5 font-weight-bold">Detalhes da Tarefa</h1>
    </div>

    <LoadingSpinner v-if="loading" text="Carregando tarefa..." />

    <v-row v-else-if="task">
      <!-- Detalhes -->
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-text class="pa-6" v-if="!editing">
            <div class="d-flex align-center justify-space-between mb-4">
              <TaskStatusChip :status="task.status" />
              <div class="d-flex ga-1">
                <v-tooltip text="Apenas o criador pode editar" :disabled="isOwner">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <v-btn
                        variant="text"
                        prepend-icon="mdi-pencil"
                        :disabled="!isOwner"
                        @click="editing = true"
                      >
                        Editar
                      </v-btn>
                    </span>
                  </template>
                </v-tooltip>

                <v-tooltip text="Apenas o criador pode excluir" :disabled="isOwner">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <v-btn
                        variant="text"
                        prepend-icon="mdi-delete"
                        color="error"
                        :disabled="!isOwner"
                        @click="showConfirm = true"
                      >
                        Excluir
                      </v-btn>
                    </span>
                  </template>
                </v-tooltip>
              </div>
            </div>
            <h2 class="text-h6 font-weight-bold mb-2">{{ task.title }}</h2>
            <p class="text-medium-emphasis">{{ task.description || 'Sem descrição.' }}</p>
          </v-card-text>

          <TaskForm
            v-else
            :task="task"
            :categories="categories"
            :users="users"
            :loading="formLoading"
            @submit="handleUpdate"
            @cancel="editing = false"
          />
        </v-card>
      </v-col>

      <!-- Info lateral -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="pa-4 text-body-1 font-weight-bold">Informações</v-card-title>
          <v-divider />
          <v-list density="compact">
            <v-list-item title="Prioridade" :subtitle="task.priority" />
            <v-list-item title="Categoria" :subtitle="task.category?.name || '—'" />
            <v-list-item title="Responsável" :subtitle="task.assignee?.name || '—'" />
            <v-list-item title="Criado por" :subtitle="task.owner?.name || '—'" />
            <v-list-item
              title="Vencimento"
              :subtitle="task.dueDate ? formatDate(task.dueDate) : '—'"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <ConfirmDialog
      v-model="showConfirm"
      message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
      :loading="deleteLoading"
      @confirm="handleDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import { useCategoryStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'
import userService from '@/services/userService'
import TaskStatusChip from '@/components/tasks/TaskStatusChip.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const isOwner = computed(() => task.value?.ownerId === authStore.user?.id)

const editing = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)
const showConfirm = ref(false)
const users = ref([])

const loading = computed(() => taskStore.loading)
const task = computed(() => taskStore.selectedTask)
const categories = computed(() => categoryStore.categories)

async function handleUpdate(data) {
  formLoading.value = true
  try {
    await taskStore.updateTask(route.params.id, data)
    editing.value = false
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  deleteLoading.value = true
  try {
    await taskStore.deleteTask(route.params.id)
    router.push('/tasks')
  } finally {
    deleteLoading.value = false
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(async () => {
  taskStore.fetchTask(route.params.id)
  categoryStore.fetchCategories()
  users.value = await userService.getAll()
})
</script>
