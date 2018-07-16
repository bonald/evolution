import { Injectable }               from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable }               from 'rxjs';
import { of }                       from 'rxjs/observable/of';
import { catchError, map, tap  }    from 'rxjs/operators';
import { AppConfig }                from '../base/config.service';
import { MessageHandlerService  }   from '../base/message-handler.service';
import { ShareSettings }            from '../../shared/settings';
import { BaseService  }             from '../base/base.service';
import { Field }                    from '../../model/time/field';
import { Resp }                     from '../../model/base/resp';

@Injectable()
export class FieldService extends BaseService {
  private uri = AppConfig.settings.apiServer.prefix.time + '/field';

  constructor(
    protected http: HttpClient,
    protected messageHandlerService: MessageHandlerService,
    protected shareSettings: ShareSettings,
  ) {
    super(http, messageHandlerService);
    this.resource = this.shareSettings.Time.Resource.Field;
  }

  List(): Observable<Field[]> {
    this.operation = this.shareSettings.System.Process.List;
    return this.http.get<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/list`).pipe(
      catchError(this.handleError<Resp>()),
      map(res => {
        let ret:Field[] = []; 
        if (res && res.code == 0) {
          res.data.map(
            one => {
              ret.push(new Field(one));
            }
          )
        }
        return ret; 
      }),
    )
  }

  Map(): Observable<Map<number, string>> {
    this.operation = this.shareSettings.System.Process.List;
    return this.http.get<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/list`).pipe(
      catchError(this.handleError<Resp>()),
      map(res => {
        let ret:Map<number, string> = new Map(); 
        if (res && res.code == 0) {
          res.data.map(
            one => {
              ret.set(one.Id, one.Name);
            }
          )
        }
        return ret; 
      }),
    )
  }
  Get(id: number): Observable<Field> {
    this.operation = this.shareSettings.System.Process.Get;
    return this.http.get<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/get/${id}`).pipe(
      catchError(this.handleError<Resp>()),
      map(res => {
        if (res && res.code == 0) {
          return new Field(res.data);
        } else {
          return new Field();
        }
      }),
    )
  }

  Add(field: Field): Observable<Field> {
    this.operation = this.shareSettings.System.Process.Create;
    return this.http.post<Resp>(AppConfig.settings.apiServer.endpoint + this.uri, JSON.stringify(field)).pipe(
      tap(res => this.log(res)),
      catchError(this.handleError<Resp>()),
      map(res => {
        if (res && res.code == 0) {
          return new Field(res.data);
        } else {
          return new Field();
        }
      }),
    );
  }

  Update(field: Field): Observable<Resp> {
    this.operation = this.shareSettings.System.Process.Update;
    return this.http.put<Resp>(AppConfig.settings.apiServer.endpoint + this.uri + `/${field.Id}`, JSON.stringify(field)).pipe(
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
