<template>
  <v-card
    class="task-card d-flex flex-column"
    :class="{ 'task-card--overdue': isOverdue }"
    height="100%"
    @click="emit('click', task)"
  >
    <v-card-item>
      <!-- Prioridade + Status -->
      <template #prepend>
        <v-icon :color="priorityColor" size="20">mdi-flag</v-icon>
      </template>

      <v-card-title class="text-body-1 font-weight-medium">
        {{ task.title }}
      </v-card-title>

      <template #append>
        <TaskStatusChip :status="task.status" />
      </template>
    </v-card-item>

    <v-card-text class="pt-0 flex-grow-1">
      <div class="info-grid">
        <template v-if="task.description">
          <span class="info-label">Descrição</span>
          <span class="info-value text-medium-emphasis">{{ task.description }}</span>
        </template>

        <template v-if="task.category">
          <span class="info-label">Categoria</span>
          <v-chip size="x-small" variant="tonal" :color="task.category.color || 'primary'">
            {{ task.category.name }}
          </v-chip>
        </template>

        <template v-if="task.dueDate">
          <span class="info-label">Prazo</span>
          <span class="info-value" :class="isOverdue ? 'text-error' : 'text-medium-emphasis'">
            <v-icon size="12" class="mr-1" :color="isOverdue ? 'error' : ''">mdi-calendar-outline</v-icon>{{ formatDate(task.dueDate) }}
          </span>
        </template>

        <template v-if="task.assignee">
          <span class="info-label">Responsável</span>
          <div class="d-flex align-center ga-1">
            <v-avatar size="16" :image="assigneeAvatar" />
            <span class="info-value text-medium-emphasis">{{ task.assignee.name }}</span>
          </div>
        </template>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import TaskStatusChip from './TaskStatusChip.vue'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['click'])

const priorityMap = {
  LOW:    'success',
  MEDIUM: 'warning',
  HIGH:   'error',
  URGENT: 'deep-orange',
}

const priorityColor = computed(() => priorityMap[props.task.priority] || 'default')

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'DONE') return false
  return new Date(props.task.dueDate) < new Date()
})

const assigneeAvatar = computed(() => {
  const name = props.task.assignee?.name || 'U'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff&size=24`
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>

<style scoped>
.task-card {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}
.task-card--overdue {
  border-left: 3px solid rgb(var(--v-theme-error));
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 7px 12px;
  align-items: center;
}

.info-label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.4);
  white-space: nowrap;
}

.info-value {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
