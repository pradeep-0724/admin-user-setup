export type ViewSettings = {
    name: string
    is_active: boolean,
  }
  
  export type EmitSettingData = {
    isSettingApplied: boolean
  }

  export type DropDownType={
    value:string,
    label:string
  }

  export type ButtonData={
        name:string,
        permission:string,
        url:string
  }
  

  export type ListWidgetData={
    tabSelection:string,
    dateRange:{
      startDate:Date,
      endDate:Date,
      selectedOpt? : string
    }
    searchValue:string,
    filterKeyData:Array<any>,
    label? :''
  }


  export type FilterDataTypes={
    isApplied:boolean,
    filteredKeys:Array<any>,
    isClear:boolean,
    isShowFilter:boolean
  }

  export type FilterDataCongig={
    display:string,
    field:string,
    type:string,
    values:Array<any>
  }