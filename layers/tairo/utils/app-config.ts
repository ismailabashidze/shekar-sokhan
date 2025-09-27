import { resolveComponent } from 'vue'

const nativeComponent = ['img', 'div']
export function resolveComponentOrNative(component: string) {
  if (typeof component !== 'string') return component
  if (nativeComponent.includes(component)) return component

  return resolveComponent(component)
}
