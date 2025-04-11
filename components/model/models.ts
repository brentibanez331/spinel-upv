export interface Candidate {
  id: string;
  full_name: string;
  display_name: string;

  political_party: string;
  image_url: string;
  personal_info: PersonalInfo[];
  candidacy: Candidacy[];
  credentials: Credentials[];
}

export interface PersonalInfo {
  id: string;
  candidate_id: string;
  birthdate: Date;
  age_on_election_day: number;
  birthplace: string;
  residence: string;
  sex: string;
  civil_status: string;
  spouse: string;
  profession: string;
}

export interface Candidacy {
  id: string;
  candidate_id: string;
  position_sought: string;
  period_of_residence?: string;
  registered_voter_of?: string;
}

export interface Credentials {
  id: string;
  candidate_id: string;
  positions_held: string[];
  education: string[];
}
