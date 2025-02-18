"""Added on delete cascade in manpower_skills

Revision ID: 7257490d17e5
Revises: e2f1cf9834ca
Create Date: 2024-05-01 20:22:48.828648

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7257490d17e5'
down_revision = 'e2f1cf9834ca'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('manpower_skills', schema=None) as batch_op:
        batch_op.drop_constraint('manpower_skills_manpower_id_fkey', type_='foreignkey')
        batch_op.drop_constraint('manpower_skills_skill_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'manpower', ['manpower_id'], ['manpower_id'], ondelete='CASCADE')
        batch_op.create_foreign_key(None, 'skills', ['skill_id'], ['skill_id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('manpower_skills', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('manpower_skills_skill_id_fkey', 'skills', ['skill_id'], ['skill_id'])
        batch_op.create_foreign_key('manpower_skills_manpower_id_fkey', 'manpower', ['manpower_id'], ['manpower_id'])

    # ### end Alembic commands ###
