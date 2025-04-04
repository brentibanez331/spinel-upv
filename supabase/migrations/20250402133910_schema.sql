create table candidates(
    id uuid primary key,
    full_name text not null,
    display_name text not null,
    political_party text not null,
    image_path text not null
);


create table personal_info(
    id uuid primary key,
    candidate_id uuid not null references candidates (id),
    birthdate date,
    age_on_election_day int,
    birthplace text,
    residence text,
    sex text,
    civil_status text,
    spouse text,
    profession text
    
);

create table candidacy(
    id uuid primary key,
    candidate_id uuid not null references candidates (id),
    position_sought text,
    period_of_residence interval,
    registered_voter_of text
);