export class TripConstants {

    vehicleTripStatus: any = {
      scheduled: {key: 'Scheduled', label: 'Scheduled', id: 0, buttonName: 'Start Job'},
      started: {key: 'started', label: 'Started', id: 1, buttonName: ''},
        completed: {key: 'completed', label: 'Completed', id: 2, buttonName: 'Complete'},
        pod_received: {key: 'pod_recevied', label: 'PoD Received', id: 3, buttonName: 'PoD Received'},
        r_billed: {key: 'r_billed', label: 'Invoice/BoS', id: 4, buttonName: ''},
        r_payment: {key: 'r_payment', label: 'Payment Received', id: 5, buttonName: ''},
        o_billed: {key: 'o_billed', label: 'Vehicle Bill', id: 6, buttonName: ''},
        o_payment: {key: 'o_payment', label: 'Payment Cleared', id: 7, buttonName: ''}
    }

    // if changes made to this, changes in billingTypes alse need and vice versa
    billingTypes: any = [{
        name:'tonnes',
        value:'1',
        label: 'Tonnes'
      },
      {
        name:'kgs',
        value:'2',
        label: 'KGS'
      },
      {
        name:'kms',
        value:'3',
        label: 'KMS'
      },
      {
        name:'litres',
        value:'4',
        label: 'Litres'
      },
      {
        name:'hour',
        value:'5',
        label: 'Hours'
      },
      {
        name:'days',
        value:'6',
        label: 'Days'
      },
      {
        name:'jobs',
        value:'10',
        label: 'Jobs'
      },
      {
        name:'gallon',
        value:'8',
        label: 'Gallon'
      },
      {
        name:'units',
        value:'9',
        label: 'Units'
      },
    ]

    // if changes made to this, changes in billingTypes alse need and vice versa
    workOrderQuantityTypes: any = [{
      name:'tonnes',
      value:'1',
      label: 'Tonnes'
    },
    {
      name:'kgs',
      value:'2',
      label: 'KGS'
    },
    {
      name:'kms',
      value:'3',
      label: 'KMS'
    },
    {
      name:'litres',
      value:'4',
      label: 'Litres'
    },
    {
      name:'gallon',
      value:'8',
      label: 'Gallon'
    },
    {
      name:'units',
      value:'9',
      label: 'Units'
    }
  ]

}

