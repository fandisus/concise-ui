import { describe, expect, expectTypeOf, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
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
  it('preserves the default icon and label rendering without a node slot', () => {
    const wrapper = mountTree()

    expect(wrapper.get('.node-icon').text()).toBe('📁')
    expect(wrapper.get('.label').text()).toBe('Users')
    expect(wrapper.find('.c-tree-view-controls').exists()).toBe(false)
  })

  it('optionally expands and collapses every branch', async () => {
    const wrapper = mount(CTreeView, {
      props: {
        items,
        itemLabel: 'name',
        itemKey: 'id',
        expandAllButton: true,
        collapseAllButton: true,
      },
      attrs: {
        class: 'application-tree',
        'aria-label': 'Permission tree',
      },
    })

    const controls = wrapper.get('.c-tree-view-controls')
    const expandButton = controls.findAll('button').find((button) => button.text() === 'Expand all')
    const collapseButton = controls
      .findAll('button')
      .find((button) => button.text() === 'Collapse all')

    expect(expandButton).toBeDefined()
    expect(collapseButton).toBeDefined()
    expect(wrapper.get('[role="tree"]').classes()).toContain('application-tree')
    expect(wrapper.get('[role="tree"]').attributes('aria-label')).toBe('Permission tree')

    await expandButton?.trigger('click')
    expect(wrapper.text()).toContain('Read users')
    expect(wrapper.text()).toContain('Write users')

    await collapseButton?.trigger('click')
    expect(wrapper.text()).not.toContain('Read users')
    expect(wrapper.text()).not.toContain('Write users')
    expect(wrapper.emitted('selection-click')).toBeUndefined()
    expect(wrapper.emitted('selection-change')).toBeUndefined()
  })

  it('renders a custom node slot for root and recursively nested nodes', async () => {
    const wrapper = mount(CTreeView, {
      props: {
        items,
        itemLabel: 'name',
        itemKey: 'id',
      },
      slots: {
        node: ({ item, depth }: { item: CTreeViewItem; depth: number }) =>
          h(
            'span',
            { class: 'custom-node', 'data-id': item.id, 'data-depth': depth },
            String(item.name),
          ),
      },
    })

    expect(wrapper.get('[data-id="root"]').attributes('data-depth')).toBe('0')
    expect(wrapper.find('.node-icon').exists()).toBe(false)

    await wrapper.get('button[aria-label="Expand Users"]').trigger('click')
    expect(wrapper.get('[data-id="read"]').attributes('data-depth')).toBe('1')

    await wrapper.get('button[aria-label="Expand Administration"]').trigger('click')
    expect(wrapper.get('[data-id="write"]').attributes('data-depth')).toBe('2')
  })

  it('provides expansion and three-state selection to the node slot', async () => {
    const wrapper = mount(CTreeView, {
      props: {
        items,
        itemLabel: 'name',
        itemKey: 'id',
        selectable: true,
      },
      slots: {
        node: ({ item, depth, isLeaf, expanded, selected, indeterminate }) =>
          h('span', {
            class: `slot-${String(item.id)}`,
            'data-depth': depth,
            'data-leaf': isLeaf,
            'data-expanded': expanded,
            'data-selected': selected,
            'data-indeterminate': indeterminate,
          }),
      },
    })

    expect(wrapper.get('.slot-root').attributes()).toMatchObject({
      'data-depth': '0',
      'data-leaf': 'false',
      'data-expanded': 'false',
      'data-selected': 'false',
      'data-indeterminate': 'false',
    })

    await wrapper.get('button[aria-label="Expand Users"]').trigger('click')
    expect(wrapper.get('.slot-root').attributes('data-expanded')).toBe('true')
    expect(wrapper.get('.slot-read').attributes('data-leaf')).toBe('true')
    expect(wrapper.get('.slot-read').attributes('data-depth')).toBe('1')

    await wrapper.get('input[aria-label="Select Read users"]').setValue(true)
    expect(wrapper.get('.slot-read').attributes('data-selected')).toBe('true')
    expect(wrapper.get('.slot-root').attributes('data-selected')).toBe('false')
    expect(wrapper.get('.slot-root').attributes('data-indeterminate')).toBe('true')
  })

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
    const mapped = tree.getFlatSelections((item) => ({
      name: String(item.name),
      url: item.url,
    }))
    expectTypeOf(mapped).toEqualTypeOf<Array<{ name: string; url: unknown }>>()
    expect(mapped).toEqual([
      { name: 'Users', url: '/users' },
      { name: 'Read users', url: '/users/read' },
      { name: 'Administration', url: undefined },
      { name: 'Write users', url: '/users/write' },
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

  it('sets predicate matches and derives parent states using the unique item key', async () => {
    const duplicateDomainValues: CTreeViewItem[] = [
      {
        id: 'folder-a',
        name: 'Folder A',
        url: '',
        children: [
          { id: 'page-a', name: 'Page A', url: '/a' },
          { id: 'page-b', name: 'Page B', url: '/b' },
        ],
      },
      {
        id: 'folder-b',
        name: 'Folder B',
        url: '',
        children: [{ id: 'page-c', name: 'Page C', url: '/c' }],
      },
    ]
    const wrapper = mount(CTreeView, {
      props: {
        items: duplicateDomainValues,
        itemLabel: 'name',
        itemKey: 'id',
        selectable: true,
      },
    })
    const tree = wrapper.vm as unknown as CTreeViewExpose

    await wrapper.get('button[aria-label="Expand Folder A"]').trigger('click')
    await wrapper.get('button[aria-label="Expand Folder B"]').trigger('click')

    tree.setSelectionsBy((item) => item.url === '/a')
    await nextTick()
    expect(tree.getFlatSelections('id')).toEqual(['page-a'])
    expect(
      (wrapper.get('input[aria-label="Select Folder A"]').element as HTMLInputElement)
        .indeterminate,
    ).toBe(true)
    expect(
      (wrapper.get('input[aria-label="Select Folder B"]').element as HTMLInputElement).checked,
    ).toBe(false)

    tree.setSelectionsBy((item) => item.url === '/a' || item.url === '/b')
    await nextTick()
    expect(tree.getFlatSelections('id')).toEqual(['folder-a', 'page-a', 'page-b'])
    expect(
      (wrapper.get('input[aria-label="Select Folder A"]').element as HTMLInputElement).checked,
    ).toBe(true)

    tree.setSelectionsBy(() => false)
    await nextTick()
    expect(tree.getFlatSelections()).toEqual([])
    expect(
      (wrapper.get('input[aria-label="Select Folder A"]').element as HTMLInputElement)
        .indeterminate,
    ).toBe(false)
    expect(wrapper.emitted('selection-change')).toHaveLength(3)
    expect(wrapper.emitted('selection-click')).toBeUndefined()
  })
})
