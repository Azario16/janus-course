import { Injectable } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SearchFormService {
  form!: UntypedFormGroup;

  private today = new Date();
  private month = this.today.getMonth();
  private year = this.today.getFullYear();
  private day = this.today.getDate();

  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private location: Location,) {
    this.route.queryParams
      .pipe()
      .subscribe(param => {
        if (param['from'] || param['from']) {
          this.form = this.formBuilder.group({
            hash: [],
            userId: [],
            dateRange: [],
            order: 'asc',
          });
        } else {
          const createdDateRange = [
            new Date(this.year, this.month, this.day - 7, 0, 0),
            new Date(this.year, this.month, this.day, 23, 59),
          ];

          this.form = this.formBuilder.group({
            hash: [],
            userId: [],
            dateRange: [createdDateRange],
            order: 'asc',
          });
        }
      });
  }

  // valueChangeTrim(): ValueChangesObservable {
  //   const hashValue$ = this.form.get('hash')!.valueChanges.pipe(
  //     map(value => {
  //       if (!value) {
  //         return [];
  //       }
  //       if (value.join('').match(/\s/g)?.length > 0) {
  //         const hashTrim = value.map((hash: string) => {
  //           return hash.trim();
  //         });
  //         this.form.patchValue({ hash: hashTrim });
  //         return hashTrim;
  //       }
  //       return value;
  //     }),
  //     startWith(this.form.get('hash')!.value || []),
  //   );

  //   const userIdSearch$ = this.form.get('userId')!.valueChanges.pipe(
  //     map(value => {
  //       if (!value) {
  //         return [];
  //       }

  //       if (value.join('').match(/\s/g)?.length > 0) {
  //         const userIdTrim = value.map((userId: string) => {
  //           return userId.trim();
  //         });
  //         this.form.patchValue({ userId: userIdTrim });
  //         return userIdTrim;
  //       }
  //       return value;
  //     }),
  //     startWith(this.form.get('userId')!.value || []),
  //   );

  //   const rangeDate$ = this.form.get('dateRange')!.valueChanges.pipe(
  //     map(value => value as string[]),
  //     startWith(this.form.get('dateRange')!.value),
  //   );

  //   const orderChanges$ = this.form
  //     .get('order')!
  //     .valueChanges.pipe(startWith<TimestampOrderType>((this.form.get('order')?.value as TimestampOrderType) || 'asc'));

  //   return { hashValue$, userIdSearch$, rangeDate$, orderChanges$ };
  // }

  getHashSearchValue(): string[] {
    return this.form.get('hash')?.value || [];
  }

  createUrlSearchParam(
    room: string,
    pluginId: string,
    videosServer: string
  ): void {
    const urlSearchParam = new URLSearchParams();

    urlSearchParam.set('room', room);
    urlSearchParam.set('pluginId', pluginId);
    urlSearchParam.set('videosServer', videosServer);

    this.location.replaceState('/webinar/auto-start?' + urlSearchParam);
  }
}
