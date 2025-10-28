export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const perPage = parseInt((query.perPage as string) || '5', 10);
  const page = parseInt((query.page as string) || '1', 10);
  const filter = (query.filter as string) || '';

  if (perPage >= 50) {
    // Create an artificial delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const data = await getDemoData();
  const offset = (page - 1) * perPage;
  const filterRe = new RegExp(filter, 'i');

  return {
    total: data.length,
    data: !filter
      ? data.slice(offset, offset + perPage)
      : data
        .filter((item) => {
          return [item.name, item.location, item.role].some(item =>
            item.match(filterRe),
          );
        })
        .slice(offset, offset + perPage),
  };
});

async function getDemoData() {
  return Promise.resolve([
    {
      id: '5',
      name: 'Mary Lebowski',
      location: 'San Diego, CA',
      level: 'Listener',
      roleColor: 'primary',
      medias: {
        avatar: '/img/avatars/5.svg',
        flag: '/img/icons/flags/united-states-of-america.svg',
      },
      stats: {
        clients: 14,
        sessions: 97,
        articles: 16,
      },
      teams: [{ src: '/img/avatars/9.svg' }, { src: '/img/avatars/11.svg' }],
    },
    {
      id: '34',
      name: 'Daniel Redbird',
      location: 'Toronto, Canada',
      level: 'Senior Therapist',
      roleColor: 'orange',
      medias: {
        avatar: '/img/avatars/20.svg',
        flag: '/img/icons/flags/canada.svg',
      },
      stats: {
        clients: 45,
        sessions: 12,
        articles: 5,
      },
      teams: [
        { src: '/img/avatars/12.svg' },
        { src: '/img/avatars/22.svg' },
        { src: '/img/avatars/10.svg' },
      ],
    },
    {
      id: '8',
      name: 'Hermann Mayer',
      location: 'New York, NY',
      level: 'Supervisor',
      roleColor: 'secondary',
      medias: {
        avatar: '/img/avatars/16.svg',
        flag: '/img/icons/flags/united-states-of-america.svg',
      },
      stats: {
        clients: 14,
        sessions: 97,
        articles: 16,
      },
      teams: [{ src: '/img/avatars/7.svg' }, { src: '/img/avatars/23.svg' }],
    },
    {
      id: '40',
      name: 'Jeanne Marchand',
      location: 'Paris, France',
      level: 'Junior Therapist',
      roleColor: 'orange',
      medias: {
        avatar: '/img/avatars/19.svg',
        flag: '/img/icons/flags/france.svg',
      },
      stats: {
        clients: 6,
        sessions: 12,
        articles: 8,
      },
      teams: [
        { src: '/img/avatars/18.svg' },
        { src: '/img/avatars/13.svg' },
        { src: '/img/avatars/8.svg' },
        { src: '/img/avatars/4.svg' },
        { src: '/img/avatars/5.svg' },
        { src: '/img/avatars/6.svg' },
        { src: '/img/avatars/7.svg' },
        { src: '/img/avatars/9.svg' },
      ],
    },
    {
      id: '27',
      name: 'Carmen Escudero',
      location: 'Madrid, Spain',
      level: 'Mid Therapist',
      roleColor: 'primary',
      medias: {
        avatar: '/img/avatars/21.svg',
        flag: '/img/icons/flags/spain.svg',
      },
      stats: {
        clients: 8,
        sessions: 158,
        articles: 54,
      },
      teams: [{ src: '/img/avatars/18.svg' }],
    },
    {
      id: '9',
      name: 'Anna Baker',
      location: 'San Francisco, CA',
      level: 'Senior Therapist',
      roleColor: 'green',
      medias: {
        avatar: '/img/avatars/9.svg',
        flag: '/img/icons/flags/united-states-of-america.svg',
      },
      stats: {
        clients: 19,
        sessions: 28,
        articles: 12,
      },
      teams: [{ src: '/img/avatars/12.svg' }, { src: '/img/avatars/5.svg' }],
    },
    {
      id: '18',
      name: 'Esteban Castellanos',
      location: 'Miami, FL',
      level: 'Senior Therapist',
      roleColor: 'green',
      medias: {
        avatar: '/img/avatars/18.svg',
        flag: '/img/icons/flags/united-states-of-america.svg',
      },
      stats: {
        clients: 59,
        sessions: 158,
        articles: 16,
      },
      teams: [
        { src: '/img/avatars/19.svg' },
        { src: '/img/avatars/16.svg' },
        { src: '/img/avatars/22.svg' },
        { src: '/img/avatars/4.svg' },
        { src: '/img/avatars/5.svg' },
        { src: '/img/avatars/2.svg' },
        { src: '/img/avatars/6.svg' },
        { src: '/img/avatars/9.svg' },
        { src: '/img/avatars/7.svg' },
        { src: '/img/avatars/3.svg' },
      ],
    },
    {
      id: '10',
      name: 'Kendra Wilson',
      location: 'Miami, FL',
      level: 'Listener',
      roleColor: 'primary',
      medias: {
        avatar: '/img/avatars/10.svg',
        flag: '/img/icons/flags/united-states-of-america.svg',
      },
      stats: {
        clients: 42,
        sessions: 15,
        articles: 2,
      },
      teams: [{ src: '/img/avatars/15.svg' }, { src: '/img/avatars/22.svg' }],
    },
    {
      id: '25',
      name: 'Melany Wallace',
      location: 'San Jose, CA',
      level: 'Listener',
      roleColor: 'orange',
      medias: {
        avatar: '/img/avatars/25.svg',
        flag: '/img/icons/flags/united-states-of-america.svg',
      },
      stats: {
        clients: 17,
        sessions: 22,
        articles: 4,
      },
      teams: [
        { src: '/img/avatars/10.svg' },
        { src: '/img/avatars/23.svg' },
        { src: '/img/avatars/16.svg' },
        { src: '/img/avatars/5.svg' },
        { src: '/img/avatars/4.svg' },
      ],
    },
    {
      id: '7',
      name: 'Thomas Anderson',
      location: 'San Diego, CA',
      level: 'Listener',
      roleColor: 'orange',
      medias: {
        avatar: '/img/avatars/7.svg',
        flag: '/img/icons/flags/united-states-of-america.svg',
      },
      stats: {
        clients: 31,
        sessions: 82,
        articles: 14,
      },
      teams: [{ src: '/img/avatars/9.svg' }, { src: '/img/avatars/14.svg' }],
    },
  ]);
}
