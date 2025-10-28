export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const perPage = parseInt((query.perPage as string) || '5', 10);
  const page = parseInt((query.page as string) || '1', 10);
  const filter = (query.filter as string) || '';
  const slug = (query.slug as string) || '';

  if (perPage >= 200) {
    // Create an artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const data = await getDemoData();
  const member = data.find(item => item.slug === slug);

  return {
    total: data.length,
    data: filterDemoData(data, filter, page, perPage),
    member,
  };
});

function filterDemoData(
  data: any[],
  filter: string,
  page: number,
  perPage: number,
) {
  const offset = (page - 1) * perPage;
  if (!filter) {
    return data.slice(offset, offset + perPage);
  }
  const filterRe = new RegExp(filter, 'i');
  return data
    .filter((item) => {
      return [item.categories, item.title].some(item => item.match(filterRe));
    })
    .slice(offset, offset + perPage);
}

async function getDemoData() {
  return Promise.resolve([
    {
      id: 1,
      slug: 'shanbe',
      name: 'شنبه',
      email: 'برنامه ای ثبت نشده است',
      picture: '/img/avatars/2.svg',
      role: {
        label: 'آزاد',
        details: [
          {
            label: 'نوبت های دولت من',
            access: '(بزودی)',
            permissions: [
              {
                label: 'امکان اتصال به سامانه ی دولت من',
                status: true,
              },
              {
                label: 'درخواست و ثبت مشاوره از طریق حاکمیت',
                status: true,
              },
              {
                label: 'مدیریت دسترسی و امکانات ویژه',
                status: true,
              },
            ],
          },
          {
            label: 'آزاد',
            access: 'Full access',
            permissions: [
              {
                label:
                  'Add/remove members, change their permissions and manage their cards',
                status: true,
              },
              {
                label:
                  'Change other admins permissions or remove them without consent',
                status: true,
              },
            ],
          },
        ],
      },
      cards: [
        {
          id: 1,
          creationDate: 'Jun 11, 2022',
          name: 'Kendra\'s card',
          account: '**** 7623',
          cardInfo: {
            name: 'Kendra Wilson',
            type: 'physical',
            brand: 'mastercard',
            number: '•••• 4479',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 142.87,
            pending: 0,
            unavailable: 249.99,
            available: 5423.12,
          },
          monthSpent: 3642.27,
          daySpent: 177.34,
          dayWithdraw: 0,
          limits: {
            spend: 250,
            withdraw: 500,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
        {
          id: 2,
          creationDate: 'Jun 11, 2022',
          name: 'Kendra\'s v-card',
          account: '**** 7218',
          cardInfo: {
            name: 'Kendra Wilson',
            type: 'virtual',
            brand: 'mastercard',
            number: '•••• 4268',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 123.89,
            pending: 12.45,
            unavailable: 0,
            available: 23893.12,
          },
          monthSpent: 4371.87,
          daySpent: 623.67,
          dayWithdraw: 600,
          limits: {
            spend: 2000,
            withdraw: 3000,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
      ],
    },
    {
      id: 2,
      slug: 'yek-shanbe',
      name: 'یک شنبه',
      email: 'برنامه ای ثبت نشده است',
      picture: '/img/avatars/8.svg',
      role: {
        label: 'آزاد',
        details: [
          {
            label: 'نوبت های دولت من',
            access: '(بزودی)',
            permissions: [
              {
                label: 'امکان اتصال به سامانه ی دولت من',
                status: true,
              },
              {
                label: 'درخواست و ثبت مشاوره از طریق حاکمیت',
                status: true,
              },
              {
                label: 'مدیریت دسترسی و امکانات ویژه',
                status: true,
              },
            ],
          },
          {
            label: 'آزاد',
            access: 'Full access',
            permissions: [
              {
                label:
                  'Add/remove members, change their permissions and manage their cards',
                status: true,
              },
              {
                label:
                  'Change other admins permissions or remove them without consent',
                status: true,
              },
            ],
          },
        ],
      },
      cards: [
        {
          id: 1,
          creationDate: 'Jun 11, 2022',
          name: 'John\'s card',
          account: '**** 7623',
          cardInfo: {
            name: 'Kendra Wilson',
            type: 'physical',
            brand: 'mastercard',
            number: '•••• 2671',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 142.87,
            pending: 0,
            unavailable: 249.99,
            available: 5423.12,
          },
          monthSpent: 3642.27,
          daySpent: 177.34,
          dayWithdraw: 0,
          limits: {
            spend: 250,
            withdraw: 500,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
      ],
    },
    {
      id: 3,
      slug: 'do-shanbe',
      name: 'دوشنبه',
      email: 'برنامه ای ثبت نشده است',
      picture: '/img/avatars/12.svg',
      role: {
        label: 'آزاد',
        details: [
          {
            label: 'نوبت های دولت من',
            access: '(بزودی)',
            permissions: [
              {
                label: 'امکان اتصال به سامانه ی دولت من',
                status: true,
              },
              {
                label: 'درخواست و ثبت مشاوره از طریق حاکمیت',
                status: true,
              },
              {
                label: 'مدیریت دسترسی و امکانات ویژه',
                status: true,
              },
            ],
          },
          {
            label: 'آزاد',
            access: 'No access',
            permissions: [
              {
                label:
                  'Add/remove members, change their permissions and manage their cards',
                status: false,
              },
              {
                label:
                  'Change other admins permissions or remove them without consent',
                status: false,
              },
            ],
          },
        ],
      },
      cards: [
        {
          id: 1,
          creationDate: 'Jun 11, 2022',
          name: 'Jennifer\'s card',
          account: '**** 7623',
          cardInfo: {
            name: 'Jennifer Wilson',
            type: 'physical',
            brand: 'mastercard',
            number: '•••• 2671',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 142.87,
            pending: 0,
            unavailable: 249.99,
            available: 5423.12,
          },
          monthSpent: 3642.27,
          daySpent: 177.34,
          dayWithdraw: 0,
          limits: {
            spend: 250,
            withdraw: 500,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
      ],
    },
    {
      id: 4,
      slug: 'se-shanbe',
      name: 'سه شنبه',
      email: 'برنامه ای ثبت نشده است',
      picture: '/img/avatars/24.svg',
      role: {
        label: 'آزاد',
        details: [
          {
            label: 'نوبت های دولت من',
            access: '(بزودی)',
            permissions: [
              {
                label: 'امکان اتصال به سامانه ی دولت من',
                status: true,
              },
              {
                label: 'درخواست و ثبت مشاوره از طریق حاکمیت',
                status: true,
              },
              {
                label: 'مدیریت دسترسی و امکانات ویژه',
                status: true,
              },
            ],
          },
          {
            label: 'آزاد',
            access: 'No access',
            permissions: [
              {
                label:
                  'Add/remove members, change their permissions and manage their cards',
                status: false,
              },
              {
                label:
                  'Change other admins permissions or remove them without consent',
                status: false,
              },
            ],
          },
        ],
      },
      cards: [
        {
          id: 1,
          creationDate: 'Jun 11, 2022',
          name: 'Amber\'s card',
          account: '**** 7623',
          cardInfo: {
            name: 'Amber Wilson',
            type: 'physical',
            brand: 'mastercard',
            number: '•••• 6982',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 142.87,
            pending: 0,
            unavailable: 249.99,
            available: 5423.12,
          },
          monthSpent: 3642.27,
          daySpent: 177.34,
          dayWithdraw: 0,
          limits: {
            spend: 250,
            withdraw: 500,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
      ],
    },
    {
      id: 5,
      slug: 'chahar-shanbe',
      name: 'چهارشنبه',
      email: 'برنامه ای ثبت نشده است',
      picture: '/img/avatars/3.svg',
      role: {
        label: 'آزاد',
        details: [
          {
            label: 'نوبت های دولت من',
            access: '(بزودی)',
            permissions: [
              {
                label: 'امکان اتصال به سامانه ی دولت من',
                status: true,
              },
              {
                label: 'درخواست و ثبت مشاوره از طریق حاکمیت',
                status: true,
              },
              {
                label: 'مدیریت دسترسی و امکانات ویژه',
                status: true,
              },
            ],
          },
          {
            label: 'آزاد',
            access: 'No access',
            permissions: [
              {
                label:
                  'Add/remove members, change their permissions and manage their cards',
                status: false,
              },
              {
                label:
                  'Change other admins permissions or remove them without consent',
                status: false,
              },
            ],
          },
        ],
      },
      cards: [
        {
          id: 1,
          creationDate: 'Jun 11, 2022',
          name: 'Kaleb\'s card',
          account: '**** 7623',
          cardInfo: {
            name: 'Kaleb Wilson',
            type: 'physical',
            brand: 'mastercard',
            number: '•••• 3112',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 142.87,
            pending: 0,
            unavailable: 249.99,
            available: 5423.12,
          },
          monthSpent: 3642.27,
          daySpent: 177.34,
          dayWithdraw: 0,
          limits: {
            spend: 250,
            withdraw: 500,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
      ],
    },
    {
      id: 6,
      slug: 'panj-shanbe',
      name: 'پنج شنبه',
      email: 'برنامه ای ثبت نشده است',
      picture: '/img/avatars/3.svg',
      role: {
        label: 'آزاد',
        details: [
          {
            label: 'نوبت های دولت من',
            access: '(بزودی)',
            permissions: [
              {
                label: 'امکان اتصال به سامانه ی دولت من',
                status: true,
              },
              {
                label: 'درخواست و ثبت مشاوره از طریق حاکمیت',
                status: true,
              },
              {
                label: 'مدیریت دسترسی و امکانات ویژه',
                status: true,
              },
            ],
          },
          {
            label: 'آزاد',
            access: 'No access',
            permissions: [
              {
                label:
                  'Add/remove members, change their permissions and manage their cards',
                status: false,
              },
              {
                label:
                  'Change other admins permissions or remove them without consent',
                status: false,
              },
            ],
          },
        ],
      },
      cards: [
        {
          id: 1,
          creationDate: 'Jun 11, 2022',
          name: 'Kaleb\'s card',
          account: '**** 7623',
          cardInfo: {
            name: 'Kaleb Wilson',
            type: 'physical',
            brand: 'mastercard',
            number: '•••• 3112',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 142.87,
            pending: 0,
            unavailable: 249.99,
            available: 5423.12,
          },
          monthSpent: 3642.27,
          daySpent: 177.34,
          dayWithdraw: 0,
          limits: {
            spend: 250,
            withdraw: 500,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
      ],
    },
    {
      id: 7,
      slug: 'jome',
      name: 'جمعه',
      email: 'برنامه ای ثبت نشده است',
      picture: '/img/avatars/3.svg',
      role: {
        label: 'آزاد',
        details: [
          {
            label: 'نوبت های دولت من',
            access: '(بزودی)',
            permissions: [
              {
                label: 'امکان اتصال به سامانه ی دولت من',
                status: true,
              },
              {
                label: 'درخواست و ثبت مشاوره از طریق حاکمیت',
                status: true,
              },
              {
                label: 'مدیریت دسترسی و امکانات ویژه',
                status: true,
              },
            ],
          },
          {
            label: 'آزاد',
            access: 'No access',
            permissions: [
              {
                label:
                  'Add/remove members, change their permissions and manage their cards',
                status: false,
              },
              {
                label:
                  'Change other admins permissions or remove them without consent',
                status: false,
              },
            ],
          },
        ],
      },
      cards: [
        {
          id: 1,
          creationDate: 'Jun 11, 2022',
          name: 'Kaleb\'s card',
          account: '**** 7623',
          cardInfo: {
            name: 'Kaleb Wilson',
            type: 'physical',
            brand: 'mastercard',
            number: '•••• 3112',
            expiryYear: '••',
            expiryMonth: '••',
            cvc: '•••',
            status: 'active',
          },
          funds: {
            posted: 142.87,
            pending: 0,
            unavailable: 249.99,
            available: 5423.12,
          },
          monthSpent: 3642.27,
          daySpent: 177.34,
          dayWithdraw: 0,
          limits: {
            spend: 250,
            withdraw: 500,
          },
          address: [
            '148, Victoria Street',
            'Suite D23, 3rd floor',
            'New York, NY',
          ],
        },
      ],
    },
  ]);
}
