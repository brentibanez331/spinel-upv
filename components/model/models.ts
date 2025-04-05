type UUID = string;

export interface Candidate {
  id: UUID;
  full_name: string;
  display_name: string;
  political_party?: string;
  image_path?: string;
  image_url?: string;
  personal_info?: PersonalInfo;
  candidacies?: Candidacy[];
}

export interface PersonalInfo {
  id: UUID;
  candidate_id: UUID;
  birthdate?: Date;
  age_on_election_day?: number;
  birthplace?: string;
  residence?: string;
  sex?: string;
  civil_status?: string;
  spouse?: string;
  profession?: string;
  candidate?: Candidate;
}

// Candidacy model
export interface Candidacy {
  id: UUID;
  candidate_id: UUID;
  position_sought: string;
  period_of_residence?: string; // Using string for interval representation
  registered_voter_of?: string;
  candidate?: Candidate;
}

// If you need to create instances with default values
export const createCandidate = (
  id: UUID,
  full_name: string,
  display_name: string,
  political_party?: string,
  image_path?: string
): Candidate => ({
  id,
  full_name,
  display_name,
  political_party,
  image_path,
  candidacies: [],
});

export const createPersonalInfo = (
  id: UUID,
  candidate_id: UUID,
  birthdate?: Date,
  age_on_election_day?: number,
  birthplace?: string,
  residence?: string,
  sex?: string,
  civil_status?: string,
  spouse?: string,
  profession?: string
): PersonalInfo => ({
  id,
  candidate_id,
  birthdate,
  age_on_election_day,
  birthplace,
  residence,
  sex,
  civil_status,
  spouse,
  profession,
});

export const createCandidacy = (
  id: UUID,
  candidate_id: UUID,
  position_sought: string,
  period_of_residence?: string,
  registered_voter_of?: string
): Candidacy => ({
  id,
  candidate_id,
  position_sought,
  period_of_residence,
  registered_voter_of,
});
