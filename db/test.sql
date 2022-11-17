\c nc_games_test

select * from reviews
join comments on reviews.review_id = comments.review_id
where reviews.review_id = 1

-- select * from reviews
-- where review_id = 1

-- select * from comments
-- join reviews on comments.review_id = reviews.review_id
-- where comments.review_id = 1