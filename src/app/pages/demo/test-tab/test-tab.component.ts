import { Component, OnInit } from '@angular/core';
import { formatDate } from '@shared/utils/dateUtil';
import { QueryTab } from '@shared/component/query-tabs/query-tabs.component';

class queryTabsMap {
  mobile: QueryTab = { value: null, label: '手机号' };
  sex: QueryTab = { value: 'ALL', label: '性别', defaultValue: 'ALL' };
  createTime: QueryTab = { value: null, label: '创建时间' };
  jobStatus: QueryTab = { value: 'ALL', label: '职业状态', defaultValue: 'ALL' };
  orderNumMin: QueryTab = { value: 0, label: '下单数量大于', defaultValue: 0 };
  orderNumMax: QueryTab = { value: 0, label: '下单数量小于', defaultValue: 0 };
  clientType: QueryTab = {
    value: null,
    label: '用户类型',
    lexicon: {
      shortfall: '短欠',
      monthly: '月结',
      ordinary: '普通',
      precharge: '预充值'
    }
  };
}

@Component({
  selector: 'test-tab',
  templateUrl: './test-tab.component.html',
  styleUrls: ['./test-tab.component.less']
})
export class TestTabComponent implements OnInit {
  tabSelectedIndex = 0;
  tabs = [
    { title: '全部', value: 'ALL' },
    { title: '在职', value: 'INSERVICE' },
    { title: '离职', value: 'DIMISSION' }
  ];

  columns = [
    { header: '姓名', field: 'name' },
    { header: '手机号', field: 'mobile' },
    { header: '性别', field: 'sex' },
    { header: '创建时间', field: 'createTime' },
    { header: '下单数量', field: 'orderNum' },
    { header: '用户类型', field: 'clientType' },
    { header: '操作', field: 'operate', width: '180px', frozenRight: 'true' }
  ];

  queryTabsMap = new queryTabsMap();
  conditionsQuery = {};

  tableData;
  selections = [];
  loading = false;

  constructor() {}

  ngOnInit() {}

  tabToggle(jobStatus) {
    this.queryTabsMap.jobStatus.value = jobStatus;
    this.updateQueryTabsMap();
  }

  updateQueryTabsMap() {
    this.queryTabsMap = { ...this.queryTabsMap };
  }

  queryChange(query) {
    this.conditionsQuery = query;
    this.loadData();
  }

  queryTabClose(closedTab) {
    if (closedTab.key === 'jobStatus') {
      this.tabSelectedIndex = 0;
    }
  }

  loadData(event = { page: 1, size: 10 }) {
    let param = { ...event, ...this.conditionsQuery };
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.tableData = {
        data: [
          {
            _id: '5ccea02e8eec600008221cc0',
            mobile: '12321424141',
            sex: '男',
            name: '测试专用笑笑',
            createTime: '2019-05-05 16:34:54',
            orderNum: '99',
            clientType: '普通'
          }
        ],
        first: true,
        last: false,
        number: 0,
        numberOfElements: 10,
        size: 10,
        totalElements: 348,
        totalPages: 35
      };
    }, 2000);
  }

  /* tab刷新 */
  _onReuseRefresh() {
    this.queryTabsMap = new queryTabsMap();
  }

  onDateOpenChange($event) {
    if ($event === false) {
      const date = this.queryTabsMap.createTime.value;
      if (date && Array.isArray(date) && date.length === 2) {
        this.queryTabsMap.createTime.value = [formatDate(date[0], '-'), formatDate(date[1], '-')];
      }
    }
  }

  onSelect($event) {
    this.selections = $event;
  }
}
