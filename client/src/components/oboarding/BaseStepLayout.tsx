import React from 'react'
import { Button, Modal } from 'antd'

import AppLayout from '../layout/AppLayout'

type BaseStepLayoutProps = {
  title: string
  onNext: () => void
  isLoading?: boolean
  disableNext?: boolean
  nextLabel?: string
}

const BaseStepLayout: React.FC<BaseStepLayoutProps> = ({ title, onNext, children, isLoading, disableNext, nextLabel }) => {
  return <AppLayout>
    <div>
      <Modal
        title={title}
        visible={true}
        onOk={onNext}
        closable={false}
        width={700}
        footer={[
          <Button key="submit" type="primary" loading={isLoading || false} onClick={onNext} disabled={disableNext || false}>
            {nextLabel || 'Suivant'}
          </Button>,
        ]}
      >
        {children}
      </Modal>
    </div>
  </AppLayout>
}

export default BaseStepLayout