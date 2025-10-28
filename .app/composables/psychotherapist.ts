export type Psychotherapist = {
  user: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  phoneNumber: string;
  email: string;
  educationLevel: 'MAStudent' | 'MA' | 'PHDStudent' | 'PHD';
  licenseStatus: 'notHaveVolunteer' | 'notHavePsychologyStudent' | 'inProgress' | 'haveOne';
  maritalStatus: 'married' | 'single';
  isAcceptOnline: boolean;
};

export function usePsychotherapist() {
  const psychotherapists = ref([]);
  const nuxtApp = useNuxtApp();
  const toaster = useToaster();
  const { user } = useUser();
  const getPsychotherapists = async () => {
    const { items } = await nuxtApp.$pb.collection('psychotherapists').getList(1, 500, {
      sort: '+created',
      expand: 'user',
    });
    psychotherapists.value = items;
    return items;
  };
  const newPsychoRegister = async (data: Psychotherapist) => {
    console.log('here');
    console.log(data);
    try {
      return await nuxtApp.$pb.collection('psychotherapists').create(data);
    }
    catch (e) {
      console.log('error');
      console.log(e);
      return e;
    }
  };
  return {
    psychotherapists,
    getPsychotherapists,
    newPsychoRegister,
  };
}
