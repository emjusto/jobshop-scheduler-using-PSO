"""Add start and end date to project and tasks

Revision ID: da62985aba13
Revises: 3ce6e79e4d0e
Create Date: 2024-05-05 16:32:30.407515

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'da62985aba13'
down_revision = '3ce6e79e4d0e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.add_column(sa.Column('end_date', sa.Date(), nullable=True))
        batch_op.alter_column('start_date',
               existing_type=sa.DATE(),
               nullable=True)

    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('start_date', sa.Date(), nullable=True))
        batch_op.add_column(sa.Column('end_date', sa.Date(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_column('end_date')
        batch_op.drop_column('start_date')

    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.alter_column('start_date',
               existing_type=sa.DATE(),
               nullable=False)
        batch_op.drop_column('end_date')

    # ### end Alembic commands ###
