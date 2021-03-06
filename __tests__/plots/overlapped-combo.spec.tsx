import React from 'react'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import ReactDOM from 'react-dom'
import OverlappedComboChart from '../../src/plots/overlapped-combo'

const uvBillData = [
  { time: '2019-03', value: 350, type: 'uv' },
  { time: '2019-04', value: 900, type: 'uv' },
  { time: '2019-05', value: 300, type: 'uv' },
  { time: '2019-06', value: 450, type: 'uv' },
  { time: '2019-07', value: 470, type: 'uv' },
  { time: '2019-03', value: 220, type: 'bill' },
  { time: '2019-04', value: 300, type: 'bill' },
  { time: '2019-05', value: 250, type: 'bill' },
  { time: '2019-06', value: 220, type: 'bill' },
  { time: '2019-07', value: 362, type: 'bill' },
]

const transformData = [
  { time: '2019-03', value: 800 },
  { time: '2019-04', value: 600 },
  { time: '2019-05', value: 400 },
  { time: '2019-06', value: 380 },
  { time: '2019-07', value: 220 },
]

const config = {
  layers: [
    {
      type: 'groupColumn',
      name: '订单量',
      data: uvBillData,
      xField: 'time',
      yField: 'value',
      groupField: 'type',
    },
    {
      type: 'line',
      name: '转化',
      data: transformData,
      xField: 'time',
      yField: 'value',
      color: '#f8ca45',
      lineSize: 2,
    },
  ],
}

describe('OverlappedComboChart', () => {
  test('render without crashed', () => {
    const div = document.createElement('div')
    ReactDOM.render(<OverlappedComboChart {...config} />, div)
  })

  test('onMount should be called', () => {
    const onMount = jest.fn()
    const div = document.createElement('div')
    ReactDOM.render(<OverlappedComboChart {...config} onMount={onMount} />, div)

    expect(onMount).toBeCalled()
  })

  test('test update config ', () => {
    const div = document.createElement('div')
    ReactDOM.render(<OverlappedComboChart {...config} />, div)

    ReactDOM.render(
      <OverlappedComboChart
        layers={[config[0], { ...config[1], lineSize: 3 }]}
      />,
      div
    )

    ReactDOM.unmountComponentAtNode(div)
  })
  test('test lifecycle', () => {
    let renderer: ReactTestRenderer

    act(() => {
      renderer = create(<OverlappedComboChart layers={[]} />)
    })

    const instance = renderer.root

    expect(instance.props.layers).toEqual([])

    expect(renderer.toJSON()).toMatchSnapshot()

    act(() => {
      renderer.update(<OverlappedComboChart {...config} />)
    })

    expect(renderer.toJSON()).toMatchSnapshot()

    expect(instance.props.layers).toEqual(config.layers)

    act(() => {
      renderer.unmount()
    })
  })
})
