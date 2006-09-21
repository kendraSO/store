create table Country (
	-- this is the ISO-3611 two-letter country code for this country
	id char(2),
	title varchar(255),
	primary key(id)
);

INSERT INTO Country (id, title) VALUES ('CA', 'Canada');
INSERT INTO Country (id, title) VALUES ('US', 'United States');
