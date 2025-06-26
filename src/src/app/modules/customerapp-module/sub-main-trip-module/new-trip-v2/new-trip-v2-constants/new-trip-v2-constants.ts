export class NewTripV2Constants{

      messageConstants={
        ALL_LOCATION_CO_ORDINATES:'All the location should have co-ordinates',
        PATH_NOT_FOUND:'No Driving Routes found for the given Co-ordinates',
      }


     pointType={
      PICKUP:'4950575f-1df4-4b46-bfaa-f4eff8a1220a',
      DROP:'0494e3b1-8c53-4e91-932f-e3f0030fecf8',
      PORT:'c5a43253-c815-405e-8ae9-4936a26f0896',
      CUSTOMERLOCATION:'24809c7b-08a9-4f03-9428-163f042474fe'
     }
      pointList=[{
        label:'Pick-up Point',
        value:1
      },
      {
        label:'Drop Point',
        value:2
      },
      {
        label:'Halt Point',
        value:3
      }]

      billingTypeList=[
        {
        label:'Tonnes',
        value:'1'
       },
      {
        label:'Kgs',
        value:'2'
      },
      {
        label:'KMS',
        value:'3'
      },
      {
        label:'Litres',
        value:'4'
      },
      {
        label:'Hours',
        value:'5'
      },
      {
        label:'Days',
        value:'6'
      },
      {
        label:'Weekly',
        value:'12'
      },
      {
        label:'Monthly',
        value:'13'
      },
      {
        label:'Gallon',
        value:'8'
      },
      {
        label:'Units',
        value:'9'
      },
      {
        label:'Jobs',
        value:'10'
      },
      {
        label:'Containers',
        value:'11'
      },
      {
        label:'Quantity',
        value:'14'
      }
    ]
    billingTypeLabels=[
      {
      label:'Tonne',
      label2:'Tonnes',
      value:'1'
     },
    {
      label:'Kg',
      label2:'Kgs',
      value:'2'
    },
    {
      label:'KMS',
      label2:'KMS',
      value:'3'
    },
    {
      label:'Litre',
      label2:'Litres',
      value:'4'
    },
    {
      label:'Hour',
      label2:'Hours',
      value:'5'
    },
    {
      label:'Day',
      label2:'Days',
      value:'6'
    },
    {
      label:'Week',
      label2:'Weeks',
      value:'12'
    },
    {
      label:'Month',
      label2:'Months',
      value:'13'
    },
    {
      label:'Gallon',
      label2:'Gallons',
      value:'8'
    },
    {
      label:'Unit',
      label2:'Unit',
      value:'9'
    },
    {
      label:'Job',
      label2:'Jobs',
      value:'10'
    },
    {
      label:'Container',
      label2:'Containers',
      value:'11'
    },
    {
      label:'Quantity',
      label2: 'Quantity',
      value:'14'
    },
    ]
    WorkOrderbillingTypeList=[
      {
      label:'Tonnes',
      value:'1'
     },
    {
      label:'Kgs',
      value:'2'
    },
    {
      label:'KMS',
      value:'3'
    },
    {
      label:'Litres',
      value:'4'
    },
    {
      label:'Hours',
      value:'5'
    },
    {
      label:'Days',
      value:'6'
    },
    {
      label:'Weekly',
      value:'12'
    },
    {
      label:'Monthly',
      value:'13'
    },
    {
      label:'Gallon',
      value:'8'
    },
    {
      label:'Units',
      value:'9'
    },
    {
      label:'Jobs',
      value:'10'
    },
    {
      label:'Containers',
      value:'11'
    }
  ]
    contentTypeList=[
      {
        label:'Text',
        value:'string'
      },
      {
        label:'Numbers',
        value:'decimal'
      },
      {
        label:'Date',
        value:'date'
      },
      // {
      //   label:'Check box',
      //   value:'checkbox'
      // },
      {
        label:'Upload',
        value:'upload'
      }
    ]
    
    toolTipMessages={
      APP_NOT_ACTIVE:{
        CONTENT:[
          `<p>Unable to fetch GPS details, Please ask the driver to download and use our <a href="https://play.google.com/store/apps/details?id=com.transportsimple.driver_app" target="_blank">employee app</a> .`
        ]

      },
      RED_MAP_ICON_TEXT:{
        CONTENT:[
          `<p>Live tracking feature is not available for Market vehicles .</p>`

        ]
      },
      WORK_ORDER:{
        CONTENT:[
          `<p>Enter the Sales Order Number given by your client here.</p>`,
          `<p> How to create a Sales Order Number:
          Click on Sales Order>Add Sales Order</p>  `,
          ` <p>Use the same Sales Order Number for multiple jobs for the same order. </p>`
        ],
      },
      TRIP_NUMBER:{
        CONTENT:[
          `<p>Job number is a fixed series to track jobs.</p> `,
          `<p>How to customize the number:</p> <p>Click on profile > page settings >Jobs > Preferences </p>`
        ],
      },
      ROUTE:{
        CONTENT:[
          `<p>Set a Route number for frequent jobs which is used to prefill the Destination section Below.</p> `,
        ],
      },
      T_AND_C:{
        CONTENT:[
          `<p>You can select your T&C for the Quotation, To add new T&C Go to Account > Page Settings > Quotation > Add T&C </p>`
        ]

      },
      SIGNATURE:{
        CONTENT:[
          `<p>You can select your Signature for the Quotation, To add new Signature Go to Account > Signature > Add Signature </p>`
        ]

      },
      POINT_TYPE:{
        CONTENT:[
          `<p>Select the desired Point </p><p>Pick-Up point: Loading place for your goods. </p>`,
          `<p>Halt Point: Where you stop in between jobs.</p>`,
          `<p> Drop Point: Unloading place for the goods </p>`,

        ],
      },
      LOCATION:{
        CONTENT:[
          `<p>Select location with Maps Icon or</p>`,
          `<p>Type the coordinates of the respective location from the "Enter Coordinates button" or</p>  `,
          ` <p> In case you do not have coordinates, simply enter the place name and proceed.</p>`
        ],
      },
      TRIP_TASK:{
        CONTENT:[
          `<p> Create and assign task list for your operators or Employees after reaching the destination.</p>`,
        ],
      },
      SCHEDULE_DATE_TIME:{
        CONTENT:[
          `<p>Enter the date and time within which your driver should reach the specified destination. </p>`,
        ],
      },
      REACH_TIME:{
        CONTENT:[
          `<p>Enter the time by which the driver should reach the destination</p>`,
        ],
      },
      HALT_TIME:{
        CONTENT:[
          `<p>This shows the amount of time driver needs to wait after reaching the destination. </p>`,
        ],
      },
      TRIP_MAP:{
        CONTENT:[
          `<p>Total estimated distance and time to complete the entire trip.   </p>`,
          `<p>The distance and time is calculated for jobs that are linked to maps or have location coordinates.</p>`,

        ],
      },
      START_TO_DEST:{
        CONTENT:[
          `<p>Shows the estimated time and distance from previous destination to the current destination. </p>`,
        ],
      },
      BILLING_TYPES:{
        CONTENT:[
          `<p>Select the unit of the freight that <br> you are transporting </p>`,
        ],
      },
      TRIP_TASK_TYPE:{
        TITLE:'TRIP TASK Type',
        CONTENT:[
          `<p>Specify what kind of information is to be entered for the specific task </p>`,
        ],
      },
      MANDATORY_TASK :{
        CONTENT:[
          `<p>If selected, these tasks are mandatory to complete. </p>`,
        ],
      },
      DRIVER_TASK:{
        CONTENT:[
          `<p>This task list is for the drivers to complete and will appear on the Employee App.</p>`,
        ],
      },
      CUSTOM_FIELD:{
        CONTENT:[
          `<p>If you want, you can add extra fields in your job section.</p>`,
          `<p>To add, click on your profile>Page Settings>Jobs>Custom Field>Add New Field</p>`,
        ],
      },
      CUSTOM_FIELD_SO:{
        CONTENT:[
          `<p>If you want, you can add extra fields in your Sales Order section.</p>`,
          `<p>To add, click on your profile>Page Settings>Sales Order>Custom Field>Add New Field</p>`,
        ],
      },
      G_MAP:[
        `<p>hello this is Google map </p>`,
        `<p>testing</p>  `,
        ` <p> <a href="https://transportsimple.com/" target="_blank">Visit transport simple</a> </p>`
      ],
      DRIVER_ALLOWANCE:{
        CONTENT:[
          `<p>Enter details of commission given to the driver. </p>`,
        ],
      },
      FUEL_EXPENSE:{
        CONTENT:[
          `<p>Enter fueling details here</p>`,
        ],
      },
      FUEL_SLIP_INFO:{
        CONTENT:[
          `<p>Challan to add fuel expense for the job</p>`,
        ],
      },
      OTHER_EXPENSES:{
        CONTENT:[
          `<p>Enter details of the expense during the job</p>`,
        ],
      },
      CHARGE_DEDUCTION:{
        CONTENT:[
          `<p>Enter charges and deduction information here </p>`,
        ],
      },
      CALCULATION_MONTH_INFO:{
        CONTENT:[
          `<p>Select the month in which you want to add the Commission to </p>`,
        ],
      },
      FINISH_TRIP:{
        CONTENT:[
          `<p>yet to add</p>`,
        ],
      },
      SCHEDULED_TIME:{
        CONTENT:[
          `<p>yet to add</p>`,
        ],
      },
      HOLD_TIME:{
        CONTENT:[
          `<p>yet to add</p>`,
        ],
      },
      DRIVER_STATUS:{
        CONTENT:[
          `<p>It shows the current location of your vehicle updated by the driver</p>`,
        ],
      },
      OFFICE_STATUS:{
        CONTENT:[
          `<p>This shows the status as updated by the office staff.</p>`,
        ],
      },
      BDP_STATUS:{
        CONTENT:[
          `<p>This shows the status as updated by the bdp office staff.</p>`,
        ],
      },
      MATERIAL_INFO:{
        CONTENT:[
          `<p>Select or enter materials transported in the vehicle for the job</p>`,
        ],
      },
      TOTAL_TRIP_TIME:{
        CONTENT:[
          `<p>You can track the estimated and actual time for the job</p>`,
        ],
      },
      TOTAL_TRIP_KM:{
        CONTENT:[
          `<p>You can track the estimated and actual distance for the job</p>`,
        ],
      },
      TRIP_DOCUMENT:{
        CONTENT:[
          `<p>Can upload documents related to the particular job</p>`,
        ],
      },
      INVOICE_SETTINGS_DEFAULT_TAX:{
        CONTENT:[
          `<p>Please select the Default Tax to be applied on the Freight/Hire charges.</p>`,
        ],
      },
      INVOICE_SETTINGS_PDF_HEADER:{
        CONTENT:[
          `<p>Manage the Header display in PDF.</p>`,
        ],
      },
      INVOICE_SETTINGS_PDF_FOOTER:{
        CONTENT:[
          `<p>Manage the Footer display in PDF.</p>`,
        ],
      },
      INVOICE_SETTINGS_BRANDING_LINE:{
        CONTENT:[
          `<p>Toggle to include the branding line: "Powered by TransportSimple.com" in the footer of the invoice PDF.</p>`,
        ],
      },
      CREDITNOTE_SETTINGS_BRANDING_LINE:{
        CONTENT:[
          `<p>Toggle to include the branding line: "Powered by TransportSimple.com" in the footer of the credit note PDF.</p>`,
        ],
      },
      DEBITTNOTE_SETTINGS_BRANDING_LINE:{
        CONTENT:[
          `<p>Toggle to include the branding line: "Powered by TransportSimple.com" in the footer of the debit note PDF.</p>`,
        ],
      },
      DRIVER_TRIP_DOCUMENT:{
        CONTENT:[
          `<p>Driver uploaded documents related to the particular job</p>`,
        ],
      },

      ESITMATETIME:{
        CONTENT:[
          `<p>Enter Estimated Time while creating Job.</p>`,
          `<p>Enter Actual time from Driver App or Office Application.</p>`,
        ],
      },
      MAINTENANCE_DELETE:{
        CONTENT:[
          `<p>Delete the services inside the job card to enable delete.</p>`,
        ],
      },
    }
    
    chargesType={
      party_add_bill_charges:'party_add_bill_charges',
      party_reduce_bill_charges:'party_reduce_bill_charges',
      vp_add_bill_charges:'vp_add_bill_charges',
      vp_reduce_bill_charges:'vp_reduce_bill_charges'
    }

    containerJobType=[
      {
        label: "Regular",
        id: "0",
        key : 'regular'
      },
      {
        label: "Couple",
        id: "1",
        key : 'couple'

      },
      {
        label: "Boggy",
        id: "2",
        key : 'boggy'

      },
      {
        label: "Side loader",
        id: "3",
        key : 'sideLoader'
      },
      {
        label: "Low bed",
        id: "4",
        key : 'lowBed'
      }
    ]

    paymentStatusList = [
      {
        label: "Unpaid",
        id: "1",
      },
      {
        label: "Paid",
        id: "3",
      },
    ];

    bdpStatusList=[
      {
        office_status:0,
        name:'Scheduled',
        date:''
      },
      {
        office_status:0,
        name:'Empty Container Pickup',
        date:''

      },
      {
        office_status:0,
        name:'Empty Container Drop',
        date:''

      },
      {
        office_status:0,
        name:'Full Container Pickup',
        date:''

      },
      {
        office_status:0,
        name:'Full Container drop',
        date:''
      }
    ]
}