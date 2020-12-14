create table if not exists Users (
    ID int not null auto_increment primary key,
    Email varchar(225) not null,
    Passhash binary(60) not null,
    UserName varchar(255) not null,
    FirstName varchar(255) not null,
    LastName varchar(255) not null,
    UserType varchar(10) not null 
);

CREATE INDEX username_index ON Users (UserName);
CREATE INDEX email_index ON Users (Email);

create table if not exists SignInLogs (
    ID int not null auto_increment primary key,
    UserID int,
    LoginTime varchar(255),
    IP varchar(255),
    foreign key (UserID) references (Users(ID))
);