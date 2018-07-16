import { Injectable }               from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable }               from 'rxjs';
import { of }                       from 'rxjs/observable/of';
import { catchError, map, tap  }    from 'rxjs/operators';
import { AppConfig }                from '../base/config.service';
import { MessageHandlerService  }   from '../base/message-handler.service';
import { ShareSettings }            from '../../shared/settings';
import { BaseService  }             from '../base/base.service';
import { Task }                     from '../../model/time/task';
import { Resp }                     from '../../model/base/resp';

@Injectable()
export class TaskService extends BaseService {
  private uri = AppConfig.settings.apiServer.prefix.time + '/task';

  constructor(
    protected http: HttpClient,
    protected messageHandlerService: MessageHandlerService,
    protected shareSettings: ShareSettings,
  ) {
    super(http, messageHandlerService);
    this.resource = this.shareSettings.Time.Resource.Task;
  }

  List(): Observable<Task[]> {
    this.operation = this.shareSettings.System.Process.List;
    return this.http.get<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/list`).pipe(
      catchError(this.handleError<Resp>()),
      map(res => {
        let ret:Task[] = []; 
        if (res && res.code == 0) {
          res.data.map(
            one => {
              ret.push(new Task(one));
            }
          )
        }
        return ret; 
      }),
    )
  }

  ListByUser(userId: number): Observable<Task[]> {
    this.operation = this.shareSettings.System.Process.List;
    return this.http.get<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/list/user/${userId}`).pipe(
      catchError(this.handleError<Resp>()),
      map(res => {
        let ret:Task[] = []; 
        if (res && res.code == 0) {
          res.data.map(
            one => {
              ret.push(new Task(one));
            }
          )
        }
        return ret; 
      }),
    )
  }

  ListWithCondition(task: Task): Observable<Task[]> {
    this.operation = this.shareSettings.System.Process.List;
    return this.http.post<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/list`, JSON.stringify(task)).pipe(
      catchError(this.handleError<Resp>()),
      map(res => {
        let ret:Task[] = []; 
        if (res && res.code == 0) {
          res.data.map(
            one => {
              ret.push(new Task(one));
            }
          )
        }
        return ret; 
      }),
    )
  }

  Get(id: number): Observable<Task> {
    this.operation = this.shareSettings.System.Process.Get;
    return this.http.get<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/get/${id}`).pipe(
      catchError(this.handleError<Resp>()),
      map(res => {
        if (res && res.code == 0) {
          return new Task(res.data);
        } else {
          return new Task();
        }
      }),
    )
  }

  Add(task: Task): Observable<Task> {
    this.operation = this.shareSettings.System.Process.Create;
    return this.http.post<Resp>(AppConfig.settings.apiServer.endpoint + this.uri, JSON.stringify(task)).pipe(
      tap(res => this.log(res)),
      catchError(this.handleError<Resp>()),
      map(res => {
        if (res && res.code == 0) {
          return new Task(res.data);
        } else {
          return new Task();
        }
      }),
    );
  }

  Update(task: Task): Observable<Resp> {
    this.operation = this.shareSettings.System.Process.Update;
    return this.http.put<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/${task.Id}`, JSON.stringify(task)).pipe(
      tap(res => this.log(res)),
      catchError(this.handleError<Resp>()),
    );
  }

  Delete(id: number): Observable<Resp> {
    this.operation = this.shareSettings.System.Process.Delete;
    return this.http.delete<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/${id}`).pipe(
      tap(res => this.log(res)),
      catchError(this.handleError<Resp>())
    );
  }
}
