import { Button } from '@/components/ui/button'
import React from 'react'
import Loader from '../loader'
import { useSubscription } from '@/hooks/useSubscription'

type Props = {
    color?: string
}

const PaymentButton = ({color}: Props) => {
    const {onSubscribe , isProcessing} = useSubscription()
  return (
    <Button className={`text-sm w-full ${color}`}
            onClick={onSubscribe} >
        <Loader color={color} state={isProcessing}>
            Upgrade Now
        </Loader>
    </Button>
  )
}

export default PaymentButton