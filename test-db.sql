TRUNCATE organization CASCADE ;
TRUNCATE office CASCADE ;
TRUNCATE service CASCADE ;
TRUNCATE ticket CASCADE ;
TRUNCATE counter CASCADE ;
TRUNCATE printer CASCADE ;
INSERT INTO organization (
    name
)
VALUES
    (
        'Banka'
    ),
    (
        'Pošta'
    ),
    (
        'Lékař'
    )
    RETURNING id;

INSERT INTO office(
    street,
    block,
    building,
    city,
    "postCode",
    "countryCode",
    "organizationId"
)
VALUES (
           'Thákurova',
           '123',
           '45',
           'Praha',
           '16000',
           'CZ',
           (SELECT id from organization where "name" = 'Banka' limit 1)
    ),
       (
           'Dlouhá',
           '678',
           '91',
           'Praha',
           '13000',
           'CZ',
           (SELECT id from organization where "name" = 'Banka' limit 1)
       ),
       (
           'Karlová',
           '123',
           '45',
           'Praha',
           '14000',
           'CZ',
           (SELECT id from organization where "name" = 'Pošta' limit 1)
       ),
       (
           'Havelská',
           '678',
           '91',
           'Praha',
           '13100',
           'CZ',
           (SELECT id from organization where "name" = 'Pošta' limit 1)
       ),
       (
           'Divadelní',
           '321',
           '54',
           'Praha',
           '14500',
           'CZ',
           (SELECT id from organization where "name" = 'Pošta' limit 1)
       ),
       (
           'Dubová',
           '123',
           '45',
           'Liberec',
           '11500',
           'CZ',
           (SELECT id from organization where "name" = 'Lékař' limit 1)
       );

INSERT INTO service(
    name,
    "officeId"
)
VALUES (
           'Bankovní převod',
           (SELECT id from office where "street" = 'Thákurova' limit 1)
    ),
       (
           'Zřízení účtu',
           (SELECT id from office where "street" = 'Thákurova' limit 1)
       ),
       (
           'Změna údajů',
           (SELECT id from office where "street" = 'Thákurova' limit 1)
       ),
       (
           'Poskytnutí úvěru',
           (SELECT id from office where "street" = 'Dlouhá' limit 1)
       ),
       (
           'Odeslání zásilky',
           (SELECT id from office where "street" = 'Karlová' limit 1)
       ),
       (
           'Prodej',
           (SELECT id from office where "street" = 'Havelská' limit 1)
       );
INSERT INTO ticket(
    "phoneId",
    "serviceId",
    "ticketNumber",
    "dateCreated"
)
VALUES (
           '12345678',
           (SELECT id from service where "name" = 'Zřízení účtu' limit 1),
    1,
    '2023-04-20 12:05:07.672855'
    ),
       (
           '12345678',
           (SELECT id from service where "name" = 'Zřízení účtu' limit 1),
           2,
           '2023-04-20 12:06:07.672855'
       ),
       (
           '12345678',
           (SELECT id from service where "name" = 'Zřízení účtu' limit 1),
           3,
           '2023-04-20 12:07:07.672855'
       );