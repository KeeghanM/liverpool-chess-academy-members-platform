-- Create a trigger that will create a new memberData record when a new user is created
CREATE TRIGGER create_member_data AFTER INSERT ON user BEGIN
INSERT INTO
  memberData (userId)
VALUES
  (NEW.id);

END;