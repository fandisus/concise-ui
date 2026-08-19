import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import CTreeView from '../components/tree-view/CTreeView.vue'
import type { CTreeViewExpose, CTreeViewItem } from '../components/tree-view/types'

const items: CTreeViewItem[] = [
  {
    id: 'root',
    name: 'Users',
    url: '/users',
    children: [
      { id: 'read', name: 'Read users', url: '/users/read' },
      {
        id: 'admin',
        name: 'Administration',
        children: [{ id: 'write', name: 'Write users', url: '/users/write' }],
      },
    ],
  },
  { id: 'reports', name: 'Reports', url: '/reports' },
]

function mountTree(selectable = false) {
  return mount(CTreeView, {
    props: {
      items,
      itemLabel: 'name',
      itemValue: 'url',
      itemKey: 'id',
      selectable,
    },
  })
}

describe('CTreeView', () => {
  it('renders recursively and expands each branch independently', async () => {
    const wrapper = mountTree()

    expect(wrapper.text()).toContain('Users')
    expect(wrapper.text()).toContain('Reports')
    expect(wrapper.text()).not.toContain('Read users')

    await wrapper.get('button[aria-label="Expand Users"]').trigger('click')
    expect(wrapper.text()).toContain('Read users')
    expect(wrapper.text()).toContain('Administration')
    expect(wrapper.text()).not.toContain('Write users')

    await wrapper.get('button[aria-label="Expand Administration"]').trigger('click')
    expect(wrapper.text()).toContain('Write users')

    await wrapper.get('button[aria-label="Collapse Users"]').trigger('click')
    expect(wrapper.text()).not.toContain('Read users')
    expect(wrapper.emitted('selection-click')).toBeUndefined()
  })

  it('propagates selection downward and recalculates ancestors', async () => {
    const wrapper = mountTree(true)
    await wrapper.get('button[aria-label="Expand Users"]').trigger('click')
    await wrapper.get('button[aria-label="Expand Administration"]').trigger('click')

    await wrapper.get('input[aria-label="Select Users"]').setValue(true)

    for (const label of ['Users', 'Read users', 'Administration', 'Write users']) {
      expect(
        (wrapper.get(`input[aria-label="Select ${label}"]`).element as HTMLInputElement).checked,
      ).toBe(true)
    }
    expect(wrapper.emitted('selection-click')).toHaveLength(1)
    expect(wrapper.emitted('selection-change')).toHaveLength(1)
    expect(wrapper.emitted('selection-click')?.[0]?.[0]).toMatchObject({
      item: items[0],
      key: 'root',
      value: '/users',
      state: 'checked',
    })

    await wrapper.get('input[aria-label="Select Read users"]').setValue(false)

    const rootInput = wrapper.get('input[aria-label="Select Users"]')
      .element as HTMLInputElement
    expect(rootInput.checked).toBe(false)
    expect(rootInput.indeterminate).toBe(true)
    expect(
      (wrapper.get('input[aria-label="Select Administration"]').element as HTMLInputElement)
        .checked,
    ).toBe(true)
    expect(wrapper.emitted('selection-click')).toHaveLength(2)
    expect(wrapper.emitted('selection-change')).toHaveLength(2)
    expect(wrapper.emitted('selection-click')?.[1]?.[0]).toMatchObject({
      item: (items[0]?.children as CTreeViewItem[])[0],
      state: 'unchecked',
    })
  })

  it('exposes hierarchical and flat selection methods', () => {
    const wrapper = mountTree(true)
    const tree = wrapper.vm as unknown as CTreeViewExpose

    tree.setSelectionsBy('url', ['/users/read', '/users/write'])

    expect(tree.getFlatSelections()).toEqual([
      items[0],
      (items[0]?.children as CTreeViewItem[])[0],
      (items[0]?.children as CTreeViewItem[])[1],
      ((items[0]?.children as CTreeViewItem[])[1]?.children as CTreeViewItem[])[0],
    ])
    expect(tree.getFlatSelections('url')).toEqual([
      '/users',
      '/users/read',
      undefined,
      '/users/write',
    ])
    expect(tree.getSelections()).toEqual([
      {
        ...items[0],
        children: [
          { ...(items[0]?.children as CTreeViewItem[])[0] },
          {
            ...(items[0]?.children as CTreeViewItem[])[1],
            children: [
              {
                ...((items[0]?.children as CTreeViewItem[])[1]
                  ?.children as CTreeViewItem[])[0],
              },
            ],
          },
        ],
      },
    ])
  })

  it('sets exact programmatic matches without selection-click or implicit descendants', () => {
    const wrapper = mountTree(true)
    const tree = wrapper.vm as unknown as CTreeViewExpose

    tree.setSelectionsBy('id', ['root'])
    expect(tree.getFlatSelections()).toEqual([])
    expect(wrapper.emitted('selection-click')).toBeUndefined()
    expect(wrapper.emitted('selection-change')).toBeUndefined()

    tree.setSelectionsBy('id', ['read'])
    expect(tree.getFlatSelections()).toEqual([(items[0]?.children as CTreeViewItem[])[0]])
    expect(wrapper.emitted('selection-click')).toBeUndefined()
    expect(wrapper.emitted('selection-change')).toHaveLength(1)
  })
})
