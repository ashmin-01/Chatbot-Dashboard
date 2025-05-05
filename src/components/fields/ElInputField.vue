<template>
  <Field :name="name" v-slot="{ value, handleChange }">
    <el-input
      :model-value="value"
      @update:model-value="
        (v: string) => {
          handleChange(v)
          $emit('getValue', v)
        }
      "
      v-bind="inputProps"
      :placeholder="t(placeholder || '')"
    >
      <template v-if="$slots.append" #append>
        <slot name="append"></slot>
      </template>
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend"></slot>
      </template>
    </el-input>
  </Field>
  <ErrorMessage class="text-red-600" :name="name" />
</template>
<script setup lang="ts">
import type { ElInput } from 'element-plus'
import { ErrorMessage, Field } from 'vee-validate'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface TextInputProps {
  name: string
  placeholder?: string
  inputProps?: Partial<typeof ElInput>
}

withDefaults(defineProps<TextInputProps>(), {})
</script>
