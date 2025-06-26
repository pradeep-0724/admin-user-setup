import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
    providedIn : 'root'
})

export class DashBoardService {

    constructor(private _http: HttpClient){

    }

    getDashboardIncomeChart(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboard + TSAPIRoutes.chart + TSAPIRoutes.income, {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardEstimatedIncome(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboard + TSAPIRoutes.chart + TSAPIRoutes.estimatedincome, {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardIncomevs30daysBack(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboard + TSAPIRoutes.chart + TSAPIRoutes.incomevs30daysback, {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardExpensevs30daysBack(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboard + TSAPIRoutes.chart + TSAPIRoutes.expensevs30daysback, {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboard(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboard, {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardIncome(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboardincome,  {params: {start_date: startDate, end_date: endDate}})
    }
    getDashboardExpenseHeader(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboardexpenseheader,  {params: {start_date: startDate, end_date: endDate}})
	}
    getDashboardExpense(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboardexpense,  {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardExpenseTrip(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report
                + TSAPIRoutes.dashboardexpensetrip,  {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardBankHeader(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.bankdashboard
                + TSAPIRoutes.header,  {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardBankAccount(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.bankdashboard
                + TSAPIRoutes.bank_account,  {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardCashAccount(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.bankdashboard
                + TSAPIRoutes.cash_account,  {params: {start_date: startDate, end_date: endDate}})
    }

    getDashboardBankChart(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.bankdashboard
                + TSAPIRoutes.chart,  {params: {start_date: startDate, end_date: endDate}})
    }

    getTripDetailsByDateAndVehicle(date, vehicleNo): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.dashboard
                + TSAPIRoutes.trip +TSAPIRoutes.trip_detail,  {params: {date:date, vehicle_no:vehicleNo}})
    }
    getTripSummary(startDate, endDate): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.trip +TSAPIRoutes.tripsummary,  {params: {start_date: startDate, end_date: endDate}})
    }

    getOverallTripStatus():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.trip)
    }

    getOverallVehicleStatus():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.vehicle)
    }

    getWorkorderSchedule():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.workorder+"scheduled/")
    }

    getWorkorderOngoing():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard + TSAPIRoutes.workorder+"ongoing/")
    }

    getFuelsStats():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard + "fuels/")
    }


    getPayables():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard + "payables/")
    }

    getReceivables():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard + "receivables/")
    }

    getTop10Payables():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard +TSAPIRoutes.party + "payables/")
    }

    getTop10Receivables():Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.report + TSAPIRoutes.dashboard +TSAPIRoutes.party+ "receivables/")
    }




    



}
